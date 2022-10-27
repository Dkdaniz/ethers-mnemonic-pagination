import {ethers} from 'ethers'

interface WalletSeed {
    [key: number]: Array<string>
}

let wallets: Array<string>;

const processSeed = (seed: string, start: number, end: number): Array<string> => {
    wallets = [];

    for (let i = start; i < end; i++) {
        wallets.push(ethers.Wallet.fromMnemonic(seed, `m/44'/60'/0'/0/${i}`).address)
    }

    return wallets;
}

const paginationSeed = async (seed: string, numPage: number, walletPerPage: number) => {
    const promiseWallets : WalletSeed = {};
    
    console.time('load')

    for (let page = 0; page < numPage; page++) {
        const start = page * walletPerPage;
        const end = (page * walletPerPage) + walletPerPage;

        console.log(start, end)
        
        promiseWallets[page] = processSeed(seed, start, end);
    }
    
    await Promise.all([promiseWallets]).then(values => {
        console.log(values[0])

        console.timeEnd('load')
    })

}

paginationSeed(process.env.SEED || "",10, 100)