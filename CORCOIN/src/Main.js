const SHA256 =require('crypto-js/sha256');

class transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
class Block{
    constructor(timestamp, transaction, previousHash = ''){
        this.timestamp=timestamp;
        this.transaction = transaction;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined:" + this.hash);
    }

}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block(0, "01/01/2017", "Genesis block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new transaction(null, miningRewardAddress, this.miningReward )
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    ischainValid(){
        for(let i = 1; i < this.chain. length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
        
            }
        }
        return true;

    }

}




let corCoin = new Blockchain();
corCoin.createTransaction(new transaction('address1', 'address2', 100));
corCoin.createTransaction(new transaction('address2', 'address1', 50));

console.log('\n Starting the miner...');
corCoin.minePendingTransactions('xaviers-add');

console.log('\nBalance of xavier is', corCoin.getBalanceOfAddress('xaviers-address'));












//console.log('mining Block 1...');
//corCoin.addBlock(new Block(1, "01/01/2021",{ amount: 4}));

//console.log('mining Block 1...');
//corCoin.addBlock(new Block(2, "02/02/2021",{ amount: 8}));
















//console.log(JSON.stringify(corCoin, null, 4));

//console.log('Is blockchain valid?' + corCoin.ischainValid());

//corCoin.chain[1].data = { amount: 100 };
//corCoin.chain[1].hash = corCoin.chain[1].calculateHash();

//console.log('Is blockchain valid?' + corCoin.ischainValid());
