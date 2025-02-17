/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.updatePurseDataTerm = (
  payload
) => {
  return `new basket(\`rho:rchain:deployId\`),
  returnCh,
  boxCh,
  stdout(\`rho:io:stdout\`),
  deployerId(\`rho:rchain:deployerId\`),
  registryLookup(\`rho:registry:lookup\`)
in {

  for (boxCh <<- @(*deployerId, "rchain-token-box", "${payload.masterRegistryUri}", "${payload.boxId}")) {
    boxCh!(("UPDATE_PURSE_DATA", { "contractId": "${payload.contractId}", "data": ${payload.data}, "pos": ${payload.pos}, "purseId": "${payload.purseId}" }, *returnCh)) |
    for (@r <- returnCh) {
      match r {
        String => {
          basket!({ "status": "failed", "message": r }) |
          stdout!(("failed", r))
        }
        _ => {
          // OP_UPDATE_PURSE_DATA_COMPLETED_BEGIN
          basket!({ "status": "completed" }) |
          stdout!("completed, data updated")
          // OP_UPDATE_PURSE_DATA_COMPLETED_END
        }
      }
    }
  }
}
`;
};
