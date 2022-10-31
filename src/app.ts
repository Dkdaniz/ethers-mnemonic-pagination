import {ethers} from 'ethers'

interface wallet {
    publicKey: string,
    privateKey: string,
}

interface WalletSeed {
    [key: number]: Array<wallet>
}

let wallets: Array<wallet>;

const processSeed = ( path: string, seed: string, start: number, end: number): Array<wallet> => {
    wallets = [];

    for (let i = start; i < end; i++) {
        wallets.push({publicKey: ethers.Wallet.fromMnemonic(seed, `${path}/${i}`).address, privateKey: ethers.Wallet.fromMnemonic(seed, `${path}/${i}`).privateKey})
    }

    return wallets;
}

const paginationSeed = async (path: string, seed: string, numPage: number, walletPerPage: number) => {
    const promiseWallets : WalletSeed = {};

    for (let page = 0; page < numPage; page++) {
        const start = page * walletPerPage;
        const end = (page * walletPerPage) + walletPerPage;
        
        promiseWallets[page] = processSeed(path, seed, start, end);
    }
    
    const wallets = await Promise.all([promiseWallets]).then(values => {
        return values[0]
    })

    console.log(wallets)
}

paginationSeed(`m/44'/60'/0'/0`, process.env.SEED || "",1, 2)