/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.deleteExpiredPurseTerm = (
  payload
) => {
  return `new basket(\`rho:rchain:deployId\`), entryCh, lookup(\`rho:registry:lookup\`), stdout(\`rho:io:stdout\`) in {
  lookup!(\`rho:id:${payload.masterRegistryUri}\`, *entryCh) |
  for(entry <- entryCh) {
    new x in {
      entry!(("PUBLIC_DELETE_EXPIRED_PURSE", "${payload.contractId}", "${payload.boxId}", "${payload.purseId}", *x)) |
      for (@r <- x) {
        match r {
          String => {
            basket!({ "status": "failed", "message": r }) |
            stdout!(("failed", r))
          }
          _ => {
            // OP_PUBLIC_DELETE_EXPIRED_PURSE_COMPLETED_BEGIN
            stdout!("completed, expired purses deleted") |
            basket!({ "status": "completed" })
            // OP_PUBLIC_DELETE_EXPIRED_PURSE_COMPLETED_END
          }
        }
      }
    }
  }
}`;
};
