const ts = require('typescript');
const fs = require('fs');
const text = fs.readFileSync('src/views/Logistics.tsx', 'utf8');
const sourceFile = ts.createSourceFile('Logistics.tsx', text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
if (sourceFile.parseDiagnostics.length === 0) {
  console.log('NO_DIAGNOSTICS');
} else {
  sourceFile.parseDiagnostics.forEach(d => {
    const { line, character } = sourceFile.getLineAndCharacterOfPosition(d.start);
    console.log(`${line+1}:${character+1} ${d.messageText}`);
  });
}
