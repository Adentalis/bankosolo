import Bank from './contracts/Bank.json'

const drizzleOptions = {
  web3: {
    block: false,
  },
  contracts: [
    Bank
  ],
  polls: {
    accounts: 1500
  }
}


export default drizzleOptions