module.exports.readPursesDataTerm = (payload) => {
  if (payload.pursesIds.length === 0) {
    return `new return in { return!({}) }`;
  }
  let rholang = `new ${payload.pursesIds.map((id, i) => 'channel' + i)} in {`;
  payload.pursesIds.forEach((p, i) => {
    rholang +=
      '\n' +
      `entry!(("PUBLIC_READ_PURSE_DATA", { "contractId": "${payload.contractId}", "purseId": "${p}" }, *channel${i})) |`;
  });
  rholang += '\n';

  rholang += `for (${payload.pursesIds
    .map((p, i) => '@value' + i + ' <- channel' + i)
    .join('; ')}) {\n`;
  rholang += `  return!({}${payload.pursesIds
    .map((p, i) => `.union({ "${p}": value${i}.slice(${parseInt(payload.chunks[p][0])}, ${payload.chunks[p].length + parseInt(payload.chunks[p][0])}) })`)
    .join('')})\n`;
  rholang += `}\n}`;

  return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
  lookup!(\`rho:id:${payload.masterRegistryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    ${rholang}
  }
}`;
};
