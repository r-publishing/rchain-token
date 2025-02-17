const { deployTerm } = require('../src');
const rc = require('rchain-toolkit');

module.exports.main = async (
  privateKey1,
  publicKey1,
  masterRegistryUri,
  boxId,
  fungible,
  contractId,
  expires
) => {
  const term = deployTerm({
    masterRegistryUri: masterRegistryUri,
    fungible: fungible,
    boxId: boxId,
    contractId: contractId,
    expires: expires || null,
  });
  console.log('  deploy is ' + Buffer.from(term).length / 1000000 + 'mb');

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
    throw new Error('deploy 01');
  }

  const data = rc.utils.rhoValToJs(
    JSON.parse(dataAtNameResponse).exprs[0].expr
  );

  if (data.status !== 'completed') {
    console.log(data);
    throw new Error('deploy 02');
  }

  return data;
};
