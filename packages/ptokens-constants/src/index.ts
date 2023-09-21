export enum NetworkId {
  SepoliaTestnet = '0xe15503e4',
  GoerliTestnet = '0xb9286154',
  ArbitrumMainnet = '0xfc8ebb2b',
  GnosisMainnet = '0xd41b1c5b',
  PolygonMainnet = '0xf9b459a1',
  BscMainnet = '0x5aca268b',
}

export enum BlockchainType {
  EVM,
  EOSIO,
  UTXO,
  ALGORAND,
}

export const networkIdToTypeMap = new Map<string, BlockchainType>([
  [NetworkId.SepoliaTestnet, BlockchainType.EVM],
  [NetworkId.GoerliTestnet, BlockchainType.EVM],
  [NetworkId.ArbitrumMainnet, BlockchainType.EVM],
  [NetworkId.GnosisMainnet, BlockchainType.EVM],
  [NetworkId.PolygonMainnet, BlockchainType.EVM],
  [NetworkId.BscMainnet, BlockchainType.EVM],
])

export enum Blockchain {
  Ethereum,
  Sepolia,
  Goerli,
  Bitcoin,
  Eos,
  Telos,
  Bsc,
  Xdai,
  Polygon,
  Ultra,
  Fio,
  Arbitrum,
  Luxochain,
  Fantom,
  Algorand,
  Libre,
  Litecoin,
  Gnosis,
}

export enum Network {
  Mainnet,
  Testnet,
}

export const FactoryAddress = new Map<NetworkId, string>([
  [NetworkId.ArbitrumMainnet, '0xcf9De65e9bB5F7fE8643dA066aB6cBC691De0Fe7'],
  [NetworkId.GnosisMainnet, '0x1f411C1b2AC7b3bB036E85AE2f4684fCd3FDbb98'],
])
