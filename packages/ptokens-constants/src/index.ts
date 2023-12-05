export enum NetworkId {
  ArbitrumMainnet = '0xfc8ebb2b',
  GnosisMainnet = '0xd41b1c5b',
  PolygonMainnet = '0xf9b459a1',
  BscMainnet = '0x5aca268b',
  GoerliTestnet = '0xb9286154',
}

export enum BlockchainType {
  EVM,
  EOSIO,
  UTXO,
  ALGORAND,
}

export const networkIdToTypeMap = new Map<string, BlockchainType>([
  [NetworkId.GnosisMainnet, BlockchainType.EVM],
  [NetworkId.BscMainnet, BlockchainType.EVM],
  [NetworkId.PolygonMainnet, BlockchainType.EVM],
  [NetworkId.GoerliTestnet, BlockchainType.EVM],
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
  [NetworkId.GoerliTestnet, '0xD64363f98aBf755f92D5cA89C57CDbc8d3D05F9c'],
  [NetworkId.GnosisMainnet, '0x26b9EF42c92c41667A8688e61C44818Ca620986F'],
  [NetworkId.BscMainnet, '0x4E2E430a73f70d55162Eb05423a89668D984dB55'],
  [NetworkId.PolygonMainnet, '0x4E2E430a73f70d55162Eb05423a89668D984dB55'],
])

// INTERIM_CHAIN_TYPE must be the BlockchainType of INTERIM_CHAIN_NETWORK_ID
export type InterimChainType = BlockchainType.EVM
export const INTERIM_CHAIN_NETWORK_ID = NetworkId.PolygonMainnet
