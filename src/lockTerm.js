/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.lockTerm = (
  payload
) => {
  return `new basket(\`rho:rchain:deployId\`),
  returnCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  for (superKey <<- @(*deployerId, "rchain-token-contract", "${payload.masterRegistryUri}", "${payload.contractId}")) {
    superKey!((
      "LOCK",
      *returnCh
    )) |
    for (@r <- returnCh) {
      match r {
        String => {
          basket!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        _ => {
          // OP_LOCK_COMPLETED_BEGIN
          stdout!("completed, contract locked") |
          basket!({ "status": "completed" })
          // OP_LOCK_COMPLETED_END
        }
      }
    }
  }
}
`;
};
