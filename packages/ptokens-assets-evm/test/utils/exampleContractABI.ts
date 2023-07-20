export default [
  {
    constant: false,
    inputs: [
      {
        internalType: 'uint256',
        name: '_number',
        type: 'uint256',
      },
    ],
    name: 'setNumber',
    outputs: [],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'number',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
] as const
