/**
 * Holds the farm for the whole app.
 *
 * My Farm, Field Details, Crop Details and the Add and Edit forms are all
 * different routes, so a new field or a new planting has to be written somewhere
 * they can all read: the Farm tab lists it, the overview total is recomputed from
 * the list, and the Home dashboard counts it. React Context does that without any
 * extra package, and the provider lives in the root layout, so fields survive
 * navigating between screens and switching tabs.
 *
 * The fields also survive an app restart. On start-up the provider reads the
 * AsyncStorage record the farmer's own saves wrote, and every change is written
 * straight back, so a plot counted today is still on My Farm tomorrow. That is
 * still frontend-only: the record lives on the device and the Spring Boot
 * backend is not involved.
 *
 * `isHydrated` tells the screens whether that read has finished. Until it has,
 * the fields shown are the demo farm, which the app never shows on its own
 * because the start-up splash covers the read, but a farmer who opens a form that
 * instant is held back from saving so their change cannot be overwritten by the
 * load.
 *
 * When the backend is ready, replace the read below with a call to the API and
 * replace the `addField` and `updateField` writes with calls to it.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { DEMO_FARM, type FarmField, type FieldCrop } from '@/models/farm';
import { loadFarmFields, saveFarmFields } from '@/services/farm-storage';

type FarmContextValue = {
  farm: {
    name: string;
    fields: FarmField[];
  };
  /** False until the saved fields have been read back from the device. */
  isHydrated: boolean;
  /** Called by Add Field when the farmer saves. */
  addField: (field: FarmField) => void;
  /** Called by Edit Field when the farmer saves changes. */
  updateField: (fieldId: string, nextField: FarmField) => void;
  /** Called by 🗑 Delete Field after the farmer confirms. */
  deleteField: (fieldId: string) => void;
  /** Called by Add Crop to plant a crop in a field. */
  setCrop: (fieldId: string, crop: FieldCrop) => void;
  /** Called by 🗑 Remove Crop after the farmer confirms, leaving the field fallow. */
  removeCrop: (fieldId: string) => void;
};

const FarmContext = createContext<FarmContextValue | null>(null);

export function FarmProvider({ children }: { children: React.ReactNode }) {
  const [fields, setFields] = useState<FarmField[]>(DEMO_FARM.fields);
  const [isHydrated, setIsHydrated] = useState(false);

  // Read the saved fields once on start-up. The effect is not allowed to set
  // state synchronously, so the load is wrapped in a promise and cancelled on
  // unmount. The demo farm renders first and is replaced a moment later, which
  // happens behind the start-up splash.
  useEffect(() => {
    let isActive = true;

    loadFarmFields().then((saved) => {
      if (!isActive) return;

      setFields(saved);
      setIsHydrated(true);
    });

    return () => {
      isActive = false;
    };
  }, []);

  // Write the list back after every change, but not before the read has finished:
  // writing the demo farm over the saved one during the first tick would undo
  // everything the farmer recorded on a previous run.
  useEffect(() => {
    if (!isHydrated) return;

    void saveFarmFields(fields);
  }, [fields, isHydrated]);

  // New fields are put at the top so the farmer sees the one they just added.
  const addField = useCallback((field: FarmField) => {
    setFields((current) => [field, ...current]);
  }, []);

  const updateField = useCallback((fieldId: string, nextField: FarmField) => {
    setFields((current) =>
      current.map((field) => (field.id === fieldId ? nextField : field))
    );
  }, []);

  const deleteField = useCallback((fieldId: string) => {
    setFields((current) => current.filter((field) => field.id !== fieldId));
  }, []);

  const setCrop = useCallback((fieldId: string, crop: FieldCrop) => {
    setFields((current) =>
      current.map((field) => (field.id === fieldId ? { ...field, crop } : field))
    );
  }, []);

  const removeCrop = useCallback((fieldId: string) => {
    setFields((current) =>
      current.map((field) => (field.id === fieldId ? { ...field, crop: null } : field))
    );
  }, []);

  // Memoised so the screens only re-render when the field list changes.
  const value = useMemo(
    () => ({
      farm: { name: DEMO_FARM.name, fields },
      isHydrated,
      addField,
      updateField,
      deleteField,
      setCrop,
      removeCrop,
    }),
    [fields, isHydrated, addField, updateField, deleteField, setCrop, removeCrop]
  );

  return <FarmContext.Provider value={value}>{children}</FarmContext.Provider>;
}

/** Reads the shared farm. Throws if used outside the provider. */
export function useFarm(): FarmContextValue {
  const value = useContext(FarmContext);

  if (!value) {
    throw new Error('useFarm must be used inside a <FarmProvider />.');
  }

  return value;
}
