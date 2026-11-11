/**
 * One-off: wraps the shared feature-screen root in <PaddyBackground>.
 *
 * Every pushed feature screen was written with the same three-part root: a
 * plain <View> painted with colors.background, a header View that repeats that
 * colour, and a ScrollView. This rewrites that root to <PaddyBackground> with a
 * transparent <View> inside it, drops the now-duplicated background colour from
 * the header, and re-indents the body by two spaces to match.
 *
 * It is a script rather than fifteen hand edits because the transformation has to
 * be identical on every screen, and a script cannot half-apply itself. It refuses
 * to touch a file whose shape it does not recognise, so a screen that was
 * rewritten by hand afterwards is reported instead of mangled, and it refuses to
 * touch a file that already imports PaddyBackground.
 *
 * The header is collapsed before the body is re-indented, because the pattern it
 * matches is the original six-space one; matching it afterwards would silently
 * find nothing and leave a screen painting over its own artwork.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const APP_DIR = join(process.cwd(), 'src', 'app');

const FILES = [
  'buyer-connection.tsx',
  'crop-health-guide.tsx',
  'harvest.tsx',
];

const IMPORT = "import { PaddyBackground } from '@/components/agri/paddy-background';";

/** Adds two spaces to every non-blank line, so the body sits inside the wrapper. */
function reindent(body, eol) {
  return body
    .split(eol)
    .map((line) => (line.length > 0 ? `  ${line}` : line))
    .join(eol);
}

/** Puts the new import first in the block of `@/components/...` imports. */
function addImport(source, eol) {
  const firstComponentImport = source.search(/^import .* from '@\/components\//m);

  if (firstComponentImport === -1) {
    throw new Error('no @/components import block to join');
  }

  return source.slice(0, firstComponentImport) + IMPORT + eol + source.slice(firstComponentImport);
}

async function rewrite(file) {
  const path = join(APP_DIR, ...file.split('/'));
  const original = await readFile(path, 'utf8');

  if (original.includes(IMPORT)) {
    return `${file}: already converted, skipped`;
  }

  // Three of these screens were written on Windows and still carry CRLF, so the
  // patterns have to be built with the file's own line ending.
  const eol = original.includes('\r\n') ? '\r\n' : '\n';

  const rootOpen = [
    '    <View style={[styles.flex, { backgroundColor: colors.background }]}>',
  ].join(eol);
  const rootClose = ['    </View>', '  );', '}'].join(eol);
  const headerOpen = [
    '      <View',
    '        style={[',
    '          styles.header,',
    '          { backgroundColor: colors.background, paddingTop: insets.top + Spacing.two },',
    '        ]}>',
    '        <View style={styles.inner}>',
  ].join(eol);
  const headerCollapsed = [
    '      <View style={[styles.header, { paddingTop: insets.top + Spacing.two }]}>',
    '        <View style={styles.inner}>',
  ].join(eol);

  const openAt = original.indexOf(rootOpen);

  if (openAt === -1) {
    return `${file}: SKIPPED, root view shape changed`;
  }

  if (!original.includes(headerOpen)) {
    return `${file}: SKIPPED, header shape changed`;
  }

  // The root view is the last `</View>\n  );\n}` in the file, so a screen whose
  // component is followed by a helper function still closes in the right place.
  const closeAt = original.lastIndexOf(rootClose);

  if (closeAt <= openAt) {
    return `${file}: SKIPPED, closing view not found after the root view`;
  }

  const body = original.slice(openAt + rootOpen.length + eol.length, closeAt);

  const updated = [
    original.slice(0, openAt),
    '    <PaddyBackground>',
    '      <View style={styles.flex}>',
    '',
    reindent(body.replace(headerOpen, headerCollapsed), eol),
    '      </View>',
    '    </PaddyBackground>',
    '  );',
    '}',
    original.slice(closeAt + rootClose.length),
  ].join(eol);

  await writeFile(path, addImport(updated, eol), 'utf8');

  return `${file}: converted`;
}

for (const file of FILES) {
  console.log(await rewrite(file));
}
