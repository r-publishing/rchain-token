/* GENERATED CODE, only edit rholang/*.rho files*/
module.exports.purchaseTerm = (
  payload
) => {
  return `
new
  basket,
  revVaultPurseCh,
  boxCh,

  returnCh,
  quantityCh,
  mergeCh,
  publicKeyCh,
  priceCh,
  newIdCh,
  dataCh,
  purseIdCh,
  contractIdCh,

  revAddressCh,
  contractExistsCh,
  proceed1Ch,
  proceed2Ch,
  registryLookup(\`rho:registry:lookup\`),
  deployerId(\`rho:rchain:deployerId\`),
  stdout(\`rho:io:stdout\`),
  revAddress(\`rho:rev:address\`)
in {

  purseIdCh!!("${payload.purseId}") |
  contractIdCh!!("${payload.contractId}") |
  newIdCh!!("${payload.newId ? payload.newId : ""}") |
  priceCh!!(${payload.price || "Nil"}) |
  mergeCh!!(${payload.merge}) |
  quantityCh!!(${payload.quantity}) |
  publicKeyCh!!("${payload.publicKey}") |
  dataCh!!("${payload.data}") |

  for (boxCh <<- @(*deployerId, "rchain-token-box", "${payload.masterRegistryUri}", "${payload.boxId}")) {

    registryLookup!(\`rho:id:${payload.masterRegistryUri}\`, *contractExistsCh) |
    for (_ <- contractExistsCh) {
      stdout!("contractExistsCh") |
      proceed1Ch!(Nil)
    } |

    registryLookup!(\`rho:rchain:revVault\`, *revVaultPurseCh) |

    /*
      Create a vault/purse that is just used once (purse)
    */
    for(@(_, *RevVaultPurse) <- revVaultPurseCh; _ <- proceed1Ch) {
      new unf, purseRevAddrCh, purseAuthKeyCh, purseVaultCh, revAddressCh, RevVaultCh in {
        revAddress!("fromUnforgeable", *unf, *purseRevAddrCh) |
        RevVaultPurse!("unforgeableAuthKey", *unf, *purseAuthKeyCh) |
        for (@purseAuthKey <- purseAuthKeyCh; @purseRevAddr <- purseRevAddrCh) {

          RevVaultPurse!("findOrCreate", purseRevAddr, *purseVaultCh) |

          for (
            @(true, purseVault) <- purseVaultCh;
            @publicKey <- publicKeyCh;
            @purseId <- purseIdCh;
            @merge <- mergeCh;
            @contractId <- contractIdCh;
            @price <- priceCh;
            @quantity <- quantityCh;
            @newId <- newIdCh;
            @data <- dataCh
          ) {

            stdout!({
              "publicKey": publicKey,
              "price": price,
              "merge": merge,
              "quantity": quantity,
              "purseId": purseId,
              "contractId": contractId,
              "newId": newId,
            }) |
            match {
              "publicKey": publicKey,
              "price": price,
              "merge": merge,
              "quantity": quantity,
              "purseId": purseId,
              "contractId": contractId,
              "newId": newId,
            } {
              {
                "publicKey": String,
                "price": Int,
                "merge": Bool,
                "quantity": Int,
                "purseId": String,
                "contractId": String,
                "newId": String,
              } => {
                proceed2Ch!(Nil)
              }
              _ => {
                basket!({ "status": "failed", "message": "error: invalid payload, cancelled purchase and payment" }) |
                stdout!(("failed", "error: invalid payload, cancelled purchase and payment"))
              }
            } |

            for (_ <- proceed2Ch) {

              revAddress!("fromPublicKey", publicKey.hexToBytes(), *revAddressCh) |
              registryLookup!(\`rho:rchain:revVault\`, *RevVaultCh) |
              for (@(_, RevVault) <- RevVaultCh; deployerRevAddress <- revAddressCh) {
                // send price * quantity REV in purse
                match (
                  *deployerRevAddress,
                  purseRevAddr,
                  price * quantity
                ) {
                  (from, to, amount) => {
                    new vaultCh, revVaultkeyCh in {
                      @RevVault!("findOrCreate", from, *vaultCh) |
                      @RevVault!("deployerAuthKey", *deployerId, *revVaultkeyCh) |
                      for (@(true, vault) <- vaultCh; key <- revVaultkeyCh) {

                        stdout!(("Beginning transfer of ", amount, "REV from", from, "to", to)) |

                        new resultCh, entryCh in {
                          @vault!("transfer", to, amount, *key, *resultCh) |
                          for (@result <- resultCh) {

                            stdout!(("Finished transfer of ", amount, "REV to", to, "result was:", result)) |
                            match result {
                              (true, Nil) => {
                                stdout!("hitting PURCHASE") |
                                boxCh!((
                                  "PURCHASE",
                                  {
                                    "contractId": contractId,
                                    "purseId": purseId,
                                    "data": data,
                                    "quantity": quantity,
                                    "merge": merge,
                                    "newId": newId,
                                    "publicKey": publicKey,
                                    "purseRevAddr": purseRevAddr,
                                    "purseAuthKey": purseAuthKey
                                  },
                                  *returnCh
                                )) |
                                for (@r <- returnCh) {
                                  match r {
                                    String => {
                                      new refundPurseBalanceCh, refundResultCh in {
                                        @purseVault!("balance", *refundPurseBalanceCh) |
                                        for (@balance <- refundPurseBalanceCh) {
                                          // the refund was successful
                                          if (balance == 0) {
                                            basket!({ "status": "failed", "message": r }) |
                                            stdout!(("failed", r))
                                          } else {
                                            @purseVault!("transfer", from, balance, purseAuthKey, *refundResultCh) |
                                            for (result <- refundResultCh)  {
                                              match *result {
                                                (true, Nil) => {
                                                  basket!({ "status": "failed", "message": "purchase failed but was able to refund " ++ balance ++ r }) |
                                                  stdout!(("error: purchase failed but was able to refund " ++ balance ++ r))
                                                }
                                                _ => {
                                                  basket!({ "status": "failed", "message": "CRITICAL purchase failed and was NOT ABLE to refund " ++ balance ++ r }) |
                                                  stdout!(("error: CRITICAL purchase failed and was NOT ABLE to refund " ++ balance ++ r))
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                    _ => {
                                      basket!({ "status": "completed" }) |
                                      stdout!("completed, purchase successful")
                                    }
                                  }
                                }
                              }
                              _ => {
                                basket!({ "status": "failed", "message": result }) |
                                stdout!(("failed", result))
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`;
};
