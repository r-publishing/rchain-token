/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.readBoxesTerm = (
  payload
) => {
  return `new return, entryCh, readCh, lookup(\`rho:registry:lookup\`) in {
  lookup!(\`rho:id:${payload.masterRegistryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    new x in {
      entry!(("PUBLIC_READ_BOXES", *x)) |
      for (y <- x) {
        return!(*y)
      }
    }
  }
}`;
};
