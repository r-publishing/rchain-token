const rc = require('rchain-toolkit');

const { createPursesTerm } = require('../src/createPursesTerm');

module.exports.main = async (
  privateKey1,
  publicKey1,
  masterRegistryUri,
  contractId,
  boxId,
  pursesToCreate,
  quantity = 3
) => {
  const payload = {
    purses: {},
    data: {},
    masterRegistryUri: masterRegistryUri,
    contractId: contractId,
    boxId: boxId,
  };
  for (let i = 0; i < pursesToCreate; i += 1) {
    payload.purses[i] = {
      id: 'auto', // will be ignored, contract is fugible contract
      boxId: boxId,
      quantity: quantity,
      price: null,
    };
  }

  const term = createPursesTerm(payload);
  console.log('  create-purses deploy is ' + Buffer.from(term).length / 1000000 + 'mb');

  let dataAtNameResponse;
  try {
    dataAtNameResponse = await rc.http.easyDeploy(
      process.env.VALIDATOR_HOST,
      term,
      privateKey1,
      1,
      1000000000,
      400000
    );
  } catch (err) {
    console.log(err);
    throw new Error('03_createTokens 02');
  }

  const data = rc.utils.rhoValToJs(
    JSON.parse(dataAtNameResponse).exprs[0].expr
  );

  return data;
};
