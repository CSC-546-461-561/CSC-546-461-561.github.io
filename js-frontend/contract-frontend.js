// https://github.com/algorand/js-algorand-sdk
// INFO - https://nodely.io/api/#free-as-in--algorand-api-access
// Which port is this using? Doesn't accept 8080. Probably 80.

const server = 'https://testnet-api.algonode.cloud';
//const port = 8080;
const api_token = '';

// https://github.com/algorand/js-algorand-sdk/tree/develop/examples
// https://developer.algorand.org/docs/sdks/javascript
const client = new algosdk.Algodv2( api_token, server );// port );

const APP_ID = 591780972; // contract that holds GOLD STARS
const APP_ADR = 'LY7FG42DZHQVASSC4VM7LSBE2V7WIJ2WQ76534X5YAYWIF2JEEDOQTUEQQ'

const ASSET_546_ID = 589995844
const ASSET_461_561_ID = 590025514


// https://dispenser.testnet.aws.algodev.network/
/*
const generatedAccount = algosdk.generateAccount();
const passphrase = algosdk.secretKeyToMnemonic(generatedAccount.sk);

console.log(`My address: ${generatedAccount.addr}`);
console.log(`My passphrase: ${passphrase}`);
*/

/* callbacks */

async function contract_optin() 
{
    var addr = document.getElementById('addr').value; 
    
    var phrase = document.getElementById('phrase').value;

    var private_key_obj;
    var err2 = false;

    try {
        private_key_obj = algosdk.mnemonicToSecretKey(phrase);
    }
    catch(err) {
        alert(err.message);
        err2 = true;
    }

    if (err2) return;

    // Python SDK
/*
    opt_in_txn = transaction.ApplicationOptInTxn(ACCT_ADR, sp, APP_ID)

    signed = opt_in_txn.sign(account_private_key)
    txid = nodelyio_algod_client.send_transaction(signed)

    result = transaction.wait_for_confirmation(nodelyio_algod_client, txid, 4)

    assert result["confirmed-round"] > 0
    print(f"Result confirmed in round: {result['confirmed-round']}")
*/

    const suggestedParams = await client.getTransactionParams().do();

    // example: APP_OPTIN
    // https://github.com/algorand/js-algorand-sdk/blob/develop/examples/app.ts

    encoded_app_id = algosdk.encodeUint64( APP_ID );

    var obj = {
        // https://algorand.github.io/js-algorand-sdk/functions/decodeAddress.html
        from: addr, // algosdk.decodeAddress( addr ),
        // https://algorand.github.io/js-algorand-sdk/functions/encodeUint64.html
        appIndex: toString(APP_ID),
        suggestedParams,
    }

    // https://algorand.github.io/js-algorand-sdk/functions/encodeObj.html

    // https://algorand.github.io/js-algorand-sdk/functions/makeApplicationOptInTxn.html
    var appOptInTxn = algosdk.makeApplicationOptInTxn( addr, suggestedParams, APP_ID );
    var signedTxn = appOptInTxn.signTxn( private_key_obj.sk );

    try {
        var tx_id = client.sendRawTransaction( signedTxn ).do();
    
        var result = await algosdk.waitForConfirmation( client
                                                  , appOptInTxn.txID().toString()
                                                  , 4 );
        
        alert( 'Result confirmed in round: ' + result['confirmed-round'] );
       
    }
    catch(err) {
        
        alert(err.message);
        err2 = true;
        
    } finally {
        
        if (err2) return;
    }
}

async function asset_optin() 
{
    var addr = document.getElementById('addr').value; 
    
    var phrase = document.getElementById('phrase').value;

    var private_key_obj;
    var err2 = false;

    try {
        private_key_obj = algosdk.mnemonicToSecretKey(phrase);
    }
    catch(err) {
        alert(err.message);
        err2 = true;
    }

    if (err2) return;

    const suggestedParams = await client.getTransactionParams().do();

    var token_for_546 = document.getElementById('546').checked

    var use_encoded_asset_id; 
    var use_asset_id; 
    
    if (token_for_546) {
        
        use_encoded_asset_id = algosdk.encodeUint64( ASSET_461_561_ID );
        use_asset_id = ASSET_546_ID;
        
    } else {
        
        use_encoded_asset_id = algosdk.encodeUint64( ASSET_461_561_ID );
        use_asset_id = ASSET_461_561_ID;
        
    }

     var obj = {
        from: addr, // for asset optin from == to, and amount = 0
        to: addr,
        amount: 0,
        //note: algosdk.encodeUint64('For Gold Start token.'), 
        suggestedParams: suggestedParams,
        assetIndex: use_asset_id,
    }

    var appAssetTransferTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject( obj );
    var signedTxn = appAssetTransferTxn.signTxn( private_key_obj.sk );

  
    try {
        var tx_id = client.sendRawTransaction( signedTxn ).do();
    
        var result = await algosdk.waitForConfirmation( client
                                                  , appAssetTransferTxn.txID().toString()
                                                  , 4 );
        
        alert( 'Result confirmed in round: ' + result['confirmed-round'] );
       
    }
    catch(err) {
        
        alert(err.message);
        err2 = true;
        
    } finally {
        
        if (err2) return;
    }
}

async function dispense() 
{
    var addr = document.getElementById('addr').value; 
    var phrase = document.getElementById('phrase').value;

    var private_key;
    var err2 = false;

    try {
        private_key_obj = algosdk.mnemonicToSecretKey(phrase);
    }
    catch(err) {
        alert(err.message);
        err2 = true;
    }

    if (err2) return;

    const sp = await client.getTransactionParams().do();

    var token_for_546 = document.getElementById('546').checked

    var use_encoded_asset_id; 
    var use_asset_id; 
    
    if (token_for_546) {
        
        use_encoded_asset_id = algosdk.encodeUint64( ASSET_546_ID );
        use_asset_id = ASSET_546_ID;
        
    } else {
        
        use_encoded_asset_id = algosdk.encodeUint64( ASSET_461_561_ID );
        use_asset_id = ASSET_461_561_ID;
        
    }

    // Python SDK
/*
    
    asset_transfer = transaction.ApplicationNoOpTxn(
    sender = ADR,
    sp = sp,
    index = APP_ID,
    app_args = [ ''.encode('utf-8'), 
                ''.encode('utf-8'),
                ( ASSET_461_561_ID ).to_bytes(8, 'big') ],
    foreign_assets = [ ASSET_461_561_ID ]
    )

    signed = asset_transfer.sign(account_private_key)
    txid = nodelyio_algod_client.send_transaction(signed)
    result = transaction.wait_for_confirmation(nodelyio_algod_client, txid, 4)
    
    assert result["confirmed-round"] > 0
    print(f"Result confirmed in round: {result['confirmed-round']}")
*/

    var obj = {
        from: addr,
        suggestedParams: sp,
        appIndex: APP_ID,
        appArgs: [ algosdk.encodeUint64(' '.charCodeAt(0)), 
                   algosdk.encodeUint64(' '.charCodeAt(0)),
                   use_encoded_asset_id ],
        foreignAssets: [ use_asset_id ],
    }

    var appNoOpTxn = algosdk.makeApplicationNoOpTxnFromObject( obj );
    var signedTxn = appNoOpTxn.signTxn( private_key_obj.sk );

    try {
        var tx_id = client.sendRawTransaction( signedTxn ).do();
    
        var result = await algosdk.waitForConfirmation( client
                                                  , appNoOpTxn.txID().toString()
                                                  , 4 );
        
        alert( 'Result confirmed in round: ' + result['confirmed-round'] );
       
    }
    catch(err) {
        
        alert(err.message);
        err2 = true;
        
    } finally {
        
        if (err2) return;
    }
}

async function balance() 
{
    // server policy on cross-origin requests?
    // https://en.wikipedia.org/wiki/Cross-origin_resource_sharing

    var addr = document.getElementById('addr').value; 

    var err2 = false;

    var token_for_546 = document.getElementById('546').checked
    var use_asset_id;
    var asset_str = '';

    if (token_for_546) {
        
        use_asset_id = ASSET_546_ID;
        asset_str = 'STAR546';
        
    } else {
        
        use_asset_id = ASSET_461_561_ID;
        asset_str = 'STARGFX'
    }

    try { // default hoisting...
        var acctInfo1 = await client.accountInformation( addr ).do();

        
        var acctInfo2 = await client.accountAssetInformation( addr
                                                         , use_asset_id ).do();
       
    } catch(err) {
        alert(err.message);
        err2 = true;
    }

    if (err2) return;

    // clear prior output
    document.getElementById('OutputDisplay').innerHTML = '';
    
    // console.log(`Account balance: ${acctInfo1.amount / 1000000} Algos`);
    // console.log(`Account balance: ' + ( acctInfo.amount / 1000000 ) + ' Algos');

    document.getElementById('OutputDisplay').innerHTML += '<p> Account balance: '
        + ( acctInfo1.amount / 1000000 ) + ' Algos <p>';

    try { // unneded due to first try-catch...
        document.getElementById('OutputDisplay').innerHTML += '<p> Account balance: '
            + acctInfo2['asset-holding'].amount + ' ' + asset_str + '<p>';
    } catch(err) {
        alert(err.message);
    }

}