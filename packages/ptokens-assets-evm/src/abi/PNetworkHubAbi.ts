export default [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'factory_',
        type: 'address',
      },
      {
        internalType: 'uint32',
        name: 'baseChallengePeriodDuration_',
        type: 'uint32',
      },
      {
        internalType: 'address',
        name: 'epochsManager_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'feesManager_',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'telepathyRouter',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'governanceMessageVerifier',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'registry',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'slasher_',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'lockedAmountChallengePeriod_',
        type: 'uint256',
      },
      {
        internalType: 'uint16',
        name: 'kChallengePeriod_',
        type: 'uint16',
      },
      {
        internalType: 'uint16',
        name: 'maxOperationsInQueue_',
        type: 'uint16',
      },
      {
        internalType: 'bytes4',
        name: 'interimChainNetworkId_',
        type: 'bytes4',
      },
      {
        internalType: 'uint256',
        name: 'lockedAmountOpenChallenge_',
        type: 'uint256',
      },
      {
        internalType: 'uint64',
        name: 'maxChallengeDuration_',
        type: 'uint64',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'CallFailed',
    type: 'error',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'actor',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'challenger',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'timestamp',
            type: 'uint64',
          },
        ],
        internalType: 'struct IPNetworkHub.Challenge',
        name: 'challenge',
        type: 'tuple',
      },
    ],
    name: 'ChallengeNotFound',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'startTimestamp',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'endTimestamp',
        type: 'uint64',
      },
    ],
    name: 'ChallengePeriodNotTerminated',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: 'startTimestamp',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'endTimestamp',
        type: 'uint64',
      },
    ],
    name: 'ChallengePeriodTerminated',
    type: 'error',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'originBlockHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'originTransactionHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'optionsMask',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingAssetDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'assetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'networkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'forwardNetworkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'underlyingAssetTokenAddress',
            type: 'address',
          },
          {
            internalType: 'bytes4',
            name: 'originNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'destinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'forwardDestinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'underlyingAssetNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'string',
            name: 'originAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'destinationAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetSymbol',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isForProtocol',
            type: 'bool',
          },
        ],
        internalType: 'struct IPNetworkHub.Operation',
        name: 'operation',
        type: 'tuple',
      },
    ],
    name: 'GovernanceOperationAlreadyCancelled',
    type: 'error',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'originBlockHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'originTransactionHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'optionsMask',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingAssetDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'assetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'networkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'forwardNetworkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'underlyingAssetTokenAddress',
            type: 'address',
          },
          {
            internalType: 'bytes4',
            name: 'originNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'destinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'forwardDestinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'underlyingAssetNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'string',
            name: 'originAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'destinationAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetSymbol',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isForProtocol',
            type: 'bool',
          },
        ],
        internalType: 'struct IPNetworkHub.Operation',
        name: 'operation',
        type: 'tuple',
      },
    ],
    name: 'GuardianOperationAlreadyCancelled',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'enum IPNetworkHub.ActorStatus',
        name: 'status',
        type: 'uint8',
      },
      {
        internalType: 'enum IPNetworkHub.ActorStatus',
        name: 'expectedStatus',
        type: 'uint8',
      },
    ],
    name: 'InvalidActorStatus',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'assetAmount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'assetTokenAddress',
        type: 'address',
      },
    ],
    name: 'InvalidAssetParameters',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'enum IPNetworkHub.ChallengeStatus',
        name: 'status',
        type: 'uint8',
      },
      {
        internalType: 'enum IPNetworkHub.ChallengeStatus',
        name: 'expectedStatus',
        type: 'uint8',
      },
    ],
    name: 'InvalidChallengeStatus',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'epoch',
        type: 'uint16',
      },
    ],
    name: 'InvalidEpoch',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'message',
        type: 'bytes',
      },
    ],
    name: 'InvalidGovernanceMessage',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'governanceMessagerVerifier',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'expectedGovernanceMessageVerifier',
        type: 'address',
      },
    ],
    name: 'InvalidGovernanceMessageVerifier',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'guardian',
        type: 'address',
      },
    ],
    name: 'InvalidGuardian',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'lockedAmountChallengePeriod',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expectedLockedAmountChallengePeriod',
        type: 'uint256',
      },
    ],
    name: 'InvalidLockedAmountChallengePeriod',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'lockedAmountStartChallenge',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'expectedLockedAmountStartChallenge',
        type: 'uint256',
      },
    ],
    name: 'InvalidLockedAmountStartChallenge',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'networkId',
        type: 'bytes4',
      },
    ],
    name: 'InvalidNetwork',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidNetworkFeeAssetAmount',
    type: 'error',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'originBlockHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'originTransactionHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'optionsMask',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingAssetDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'assetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'networkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'forwardNetworkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'underlyingAssetTokenAddress',
            type: 'address',
          },
          {
            internalType: 'bytes4',
            name: 'originNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'destinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'forwardDestinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'underlyingAssetNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'string',
            name: 'originAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'destinationAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetSymbol',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isForProtocol',
            type: 'bool',
          },
        ],
        internalType: 'struct IPNetworkHub.Operation',
        name: 'operation',
        type: 'tuple',
      },
    ],
    name: 'InvalidProtocolFee',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'protocolFeeAssetAmount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'protocolFeeAssetTokenAddress',
        type: 'address',
      },
    ],
    name: 'InvalidProtocolFeeAssetParameters',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sentinel',
        type: 'address',
      },
    ],
    name: 'InvalidSentinel',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidUserOperation',
    type: 'error',
  },
  {
    inputs: [],
    name: 'LockDown',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MaxChallengeDurationMustBeLessOrEqualThanMaxChallengePeriodDuration',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MaxChallengeDurationNotPassed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MaxChallengeDurationPassed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NearToEpochEnd',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NoUserOperation',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'addr',
        type: 'address',
      },
    ],
    name: 'NotContract',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'router',
        type: 'address',
      },
    ],
    name: 'NotRouter',
    type: 'error',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'originBlockHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'originTransactionHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'optionsMask',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingAssetDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'assetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'networkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'forwardNetworkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'underlyingAssetTokenAddress',
            type: 'address',
          },
          {
            internalType: 'bytes4',
            name: 'originNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'destinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'forwardDestinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'underlyingAssetNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'string',
            name: 'originAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'destinationAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetSymbol',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isForProtocol',
            type: 'bool',
          },
        ],
        internalType: 'struct IPNetworkHub.Operation',
        name: 'operation',
        type: 'tuple',
      },
    ],
    name: 'OperationAlreadyCancelled',
    type: 'error',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'originBlockHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'originTransactionHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'optionsMask',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingAssetDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'assetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'networkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'forwardNetworkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'underlyingAssetTokenAddress',
            type: 'address',
          },
          {
            internalType: 'bytes4',
            name: 'originNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'destinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'forwardDestinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'underlyingAssetNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'string',
            name: 'originAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'destinationAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetSymbol',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isForProtocol',
            type: 'bool',
          },
        ],
        internalType: 'struct IPNetworkHub.Operation',
        name: 'operation',
        type: 'tuple',
      },
    ],
    name: 'OperationAlreadyExecuted',
    type: 'error',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'originBlockHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'originTransactionHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'optionsMask',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingAssetDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'assetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'networkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'forwardNetworkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'underlyingAssetTokenAddress',
            type: 'address',
          },
          {
            internalType: 'bytes4',
            name: 'originNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'destinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'forwardDestinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'underlyingAssetNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'string',
            name: 'originAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'destinationAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetSymbol',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isForProtocol',
            type: 'bool',
          },
        ],
        internalType: 'struct IPNetworkHub.Operation',
        name: 'operation',
        type: 'tuple',
      },
    ],
    name: 'OperationAlreadyQueued',
    type: 'error',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'originBlockHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'originTransactionHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'optionsMask',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingAssetDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'assetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'networkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'forwardNetworkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'underlyingAssetTokenAddress',
            type: 'address',
          },
          {
            internalType: 'bytes4',
            name: 'originNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'destinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'forwardDestinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'underlyingAssetNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'string',
            name: 'originAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'destinationAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetSymbol',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isForProtocol',
            type: 'bool',
          },
        ],
        internalType: 'struct IPNetworkHub.Operation',
        name: 'operation',
        type: 'tuple',
      },
    ],
    name: 'OperationNotQueued',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'pTokenAddress',
        type: 'address',
      },
    ],
    name: 'PTokenNotCreated',
    type: 'error',
  },
  {
    inputs: [],
    name: 'QueueFull',
    type: 'error',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'originBlockHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'originTransactionHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'optionsMask',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingAssetDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'assetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'networkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'forwardNetworkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'underlyingAssetTokenAddress',
            type: 'address',
          },
          {
            internalType: 'bytes4',
            name: 'originNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'destinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'forwardDestinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'underlyingAssetNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'string',
            name: 'originAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'destinationAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetSymbol',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isForProtocol',
            type: 'bool',
          },
        ],
        internalType: 'struct IPNetworkHub.Operation',
        name: 'operation',
        type: 'tuple',
      },
    ],
    name: 'SentinelOperationAlreadyCancelled',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'sourceChainId',
        type: 'uint32',
      },
    ],
    name: 'UnsupportedChainId',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'actor',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'challenger',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'timestamp',
            type: 'uint64',
          },
        ],
        indexed: false,
        internalType: 'struct IPNetworkHub.Challenge',
        name: 'challenge',
        type: 'tuple',
      },
    ],
    name: 'ChallengeCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'actor',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'challenger',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'timestamp',
            type: 'uint64',
          },
        ],
        indexed: false,
        internalType: 'struct IPNetworkHub.Challenge',
        name: 'challenge',
        type: 'tuple',
      },
    ],
    name: 'ChallengePartiallyUnsolved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'actor',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'challenger',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'timestamp',
            type: 'uint64',
          },
        ],
        indexed: false,
        internalType: 'struct IPNetworkHub.Challenge',
        name: 'challenge',
        type: 'tuple',
      },
    ],
    name: 'ChallengePending',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'actor',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'challenger',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'timestamp',
            type: 'uint64',
          },
        ],
        indexed: false,
        internalType: 'struct IPNetworkHub.Challenge',
        name: 'challenge',
        type: 'tuple',
      },
    ],
    name: 'ChallengeSolved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'actor',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'challenger',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'timestamp',
            type: 'uint64',
          },
        ],
        indexed: false,
        internalType: 'struct IPNetworkHub.Challenge',
        name: 'challenge',
        type: 'tuple',
      },
    ],
    name: 'ChallengeUnsolved',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'originBlockHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'originTransactionHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'optionsMask',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingAssetDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'assetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'networkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'forwardNetworkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'underlyingAssetTokenAddress',
            type: 'address',
          },
          {
            internalType: 'bytes4',
            name: 'originNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'destinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'forwardDestinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'underlyingAssetNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'string',
            name: 'originAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'destinationAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetSymbol',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isForProtocol',
            type: 'bool',
          },
        ],
        indexed: false,
        internalType: 'struct IPNetworkHub.Operation',
        name: 'operation',
        type: 'tuple',
      },
    ],
    name: 'GovernanceOperationCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'originBlockHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'originTransactionHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'optionsMask',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingAssetDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'assetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'networkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'forwardNetworkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'underlyingAssetTokenAddress',
            type: 'address',
          },
          {
            internalType: 'bytes4',
            name: 'originNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'destinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'forwardDestinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'underlyingAssetNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'string',
            name: 'originAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'destinationAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetSymbol',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isForProtocol',
            type: 'bool',
          },
        ],
        indexed: false,
        internalType: 'struct IPNetworkHub.Operation',
        name: 'operation',
        type: 'tuple',
      },
    ],
    name: 'GuardianOperationCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint16',
        name: 'epoch',
        type: 'uint16',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'guardian',
        type: 'address',
      },
    ],
    name: 'GuardianResumed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint16',
        name: 'epoch',
        type: 'uint16',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'guardian',
        type: 'address',
      },
    ],
    name: 'GuardianSlashed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'originBlockHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'originTransactionHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'optionsMask',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingAssetDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'assetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'networkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'forwardNetworkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'underlyingAssetTokenAddress',
            type: 'address',
          },
          {
            internalType: 'bytes4',
            name: 'originNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'destinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'forwardDestinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'underlyingAssetNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'string',
            name: 'originAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'destinationAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetSymbol',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isForProtocol',
            type: 'bool',
          },
        ],
        indexed: false,
        internalType: 'struct IPNetworkHub.Operation',
        name: 'operation',
        type: 'tuple',
      },
    ],
    name: 'OperationCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'originBlockHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'originTransactionHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'optionsMask',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingAssetDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'assetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'networkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'forwardNetworkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'underlyingAssetTokenAddress',
            type: 'address',
          },
          {
            internalType: 'bytes4',
            name: 'originNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'destinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'forwardDestinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'underlyingAssetNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'string',
            name: 'originAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'destinationAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetSymbol',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isForProtocol',
            type: 'bool',
          },
        ],
        indexed: false,
        internalType: 'struct IPNetworkHub.Operation',
        name: 'operation',
        type: 'tuple',
      },
    ],
    name: 'OperationExecuted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'originBlockHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'originTransactionHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'optionsMask',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingAssetDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'assetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'networkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'forwardNetworkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'underlyingAssetTokenAddress',
            type: 'address',
          },
          {
            internalType: 'bytes4',
            name: 'originNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'destinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'forwardDestinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'underlyingAssetNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'string',
            name: 'originAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'destinationAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetSymbol',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isForProtocol',
            type: 'bool',
          },
        ],
        indexed: false,
        internalType: 'struct IPNetworkHub.Operation',
        name: 'operation',
        type: 'tuple',
      },
    ],
    name: 'OperationQueued',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'originBlockHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'originTransactionHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'optionsMask',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingAssetDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'assetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'networkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'forwardNetworkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'underlyingAssetTokenAddress',
            type: 'address',
          },
          {
            internalType: 'bytes4',
            name: 'originNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'destinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'forwardDestinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'underlyingAssetNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'string',
            name: 'originAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'destinationAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetSymbol',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isForProtocol',
            type: 'bool',
          },
        ],
        indexed: false,
        internalType: 'struct IPNetworkHub.Operation',
        name: 'operation',
        type: 'tuple',
      },
    ],
    name: 'SentinelOperationCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint16',
        name: 'epoch',
        type: 'uint16',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sentinel',
        type: 'address',
      },
    ],
    name: 'SentinelResumed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint16',
        name: 'epoch',
        type: 'uint16',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'sentinel',
        type: 'address',
      },
    ],
    name: 'SentinelSlashed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'originAccount',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'destinationAccount',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'bytes4',
        name: 'destinationNetworkId',
        type: 'bytes4',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'underlyingAssetName',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'underlyingAssetSymbol',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'underlyingAssetDecimals',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'underlyingAssetTokenAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bytes4',
        name: 'underlyingAssetNetworkId',
        type: 'bytes4',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'assetTokenAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'assetAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'protocolFeeAssetTokenAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'protocolFeeAssetAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'networkFeeAssetAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'forwardNetworkFeeAssetAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes4',
        name: 'forwardDestinationNetworkId',
        type: 'bytes4',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'userData',
        type: 'bytes',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'optionsMask',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isForProtocol',
        type: 'bool',
      },
    ],
    name: 'UserOperation',
    type: 'event',
  },
  {
    inputs: [],
    name: 'FEE_BASIS_POINTS_DIVISOR',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'GOVERNANCE_MESSAGE_GUARDIANS',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'GOVERNANCE_MESSAGE_RESUME_GUARDIAN',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'GOVERNANCE_MESSAGE_RESUME_SENTINEL',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'GOVERNANCE_MESSAGE_SENTINELS',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'GOVERNANCE_MESSAGE_SLASH_GUARDIAN',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'GOVERNANCE_MESSAGE_SLASH_SENTINEL',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'baseChallengePeriodDuration',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'actor',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'challenger',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'timestamp',
            type: 'uint64',
          },
        ],
        internalType: 'struct IPNetworkHub.Challenge',
        name: 'challenge',
        type: 'tuple',
      },
    ],
    name: 'challengeIdOf',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'originBlockHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'originTransactionHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'optionsMask',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingAssetDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'assetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'networkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'forwardNetworkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'underlyingAssetTokenAddress',
            type: 'address',
          },
          {
            internalType: 'bytes4',
            name: 'originNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'destinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'forwardDestinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'underlyingAssetNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'string',
            name: 'originAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'destinationAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetSymbol',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isForProtocol',
            type: 'bool',
          },
        ],
        internalType: 'struct IPNetworkHub.Operation',
        name: 'operation',
        type: 'tuple',
      },
    ],
    name: 'challengePeriodOf',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'challengesNonce',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'actor',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'challenger',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'timestamp',
            type: 'uint64',
          },
        ],
        internalType: 'struct IPNetworkHub.Challenge',
        name: 'challenge',
        type: 'tuple',
      },
    ],
    name: 'claimLockedAmountStartChallenge',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'epochsManager',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'factory',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feesManager',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'actor',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'challenger',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'timestamp',
            type: 'uint64',
          },
        ],
        internalType: 'struct IPNetworkHub.Challenge',
        name: 'challenge',
        type: 'tuple',
      },
    ],
    name: 'getChallengeEpoch',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'actor',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'challenger',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'timestamp',
            type: 'uint64',
          },
        ],
        internalType: 'struct IPNetworkHub.Challenge',
        name: 'challenge',
        type: 'tuple',
      },
    ],
    name: 'getChallengeStatus',
    outputs: [
      {
        internalType: 'enum IPNetworkHub.ChallengeStatus',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCurrentActiveActorsAdjustmentDuration',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCurrentChallengePeriodDuration',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCurrentQueuedOperationsAdjustmentDuration',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'epoch',
        type: 'uint16',
      },
    ],
    name: 'getGuardiansMerkleRootForEpoch',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getNetworkId',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'epoch',
        type: 'uint16',
      },
      {
        internalType: 'address',
        name: 'actor',
        type: 'address',
      },
    ],
    name: 'getPendingChallengeIdByEpochOf',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint16',
        name: 'epoch',
        type: 'uint16',
      },
    ],
    name: 'getSentinelsMerkleRootForEpoch',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getTotalNumberOfInactiveActorsForCurrentEpoch',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'governanceMessageVerifier',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'sourceChainId',
        type: 'uint32',
      },
      {
        internalType: 'address',
        name: 'sourceSender',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'handleTelepathy',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'interimChainNetworkId',
    outputs: [
      {
        internalType: 'bytes4',
        name: '',
        type: 'bytes4',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'kChallengePeriod',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lockedAmountChallengePeriod',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lockedAmountStartChallenge',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxChallengeDuration',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxOperationsInQueue',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'numberOfOperationsInQueue',
    outputs: [
      {
        internalType: 'uint16',
        name: '',
        type: 'uint16',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'originBlockHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'originTransactionHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'optionsMask',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingAssetDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'assetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'networkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'forwardNetworkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'underlyingAssetTokenAddress',
            type: 'address',
          },
          {
            internalType: 'bytes4',
            name: 'originNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'destinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'forwardDestinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'underlyingAssetNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'string',
            name: 'originAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'destinationAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetSymbol',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isForProtocol',
            type: 'bool',
          },
        ],
        internalType: 'struct IPNetworkHub.Operation',
        name: 'operation',
        type: 'tuple',
      },
    ],
    name: 'operationIdOf',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'originBlockHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'originTransactionHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'optionsMask',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingAssetDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'assetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'networkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'forwardNetworkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'underlyingAssetTokenAddress',
            type: 'address',
          },
          {
            internalType: 'bytes4',
            name: 'originNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'destinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'forwardDestinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'underlyingAssetNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'string',
            name: 'originAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'destinationAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetSymbol',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isForProtocol',
            type: 'bool',
          },
        ],
        internalType: 'struct IPNetworkHub.Operation',
        name: 'operation',
        type: 'tuple',
      },
    ],
    name: 'operationStatusOf',
    outputs: [
      {
        internalType: 'enum IPNetworkHub.OperationStatus',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'originBlockHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'originTransactionHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'optionsMask',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingAssetDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'assetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'networkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'forwardNetworkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'underlyingAssetTokenAddress',
            type: 'address',
          },
          {
            internalType: 'bytes4',
            name: 'originNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'destinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'forwardDestinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'underlyingAssetNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'string',
            name: 'originAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'destinationAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetSymbol',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isForProtocol',
            type: 'bool',
          },
        ],
        internalType: 'struct IPNetworkHub.Operation',
        name: 'operation',
        type: 'tuple',
      },
    ],
    name: 'protocolExecuteOperation',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'originBlockHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'originTransactionHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'optionsMask',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingAssetDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'assetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'networkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'forwardNetworkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'underlyingAssetTokenAddress',
            type: 'address',
          },
          {
            internalType: 'bytes4',
            name: 'originNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'destinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'forwardDestinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'underlyingAssetNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'string',
            name: 'originAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'destinationAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetSymbol',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isForProtocol',
            type: 'bool',
          },
        ],
        internalType: 'struct IPNetworkHub.Operation',
        name: 'operation',
        type: 'tuple',
      },
    ],
    name: 'protocolGovernanceCancelOperation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'originBlockHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'originTransactionHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'optionsMask',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingAssetDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'assetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'networkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'forwardNetworkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'underlyingAssetTokenAddress',
            type: 'address',
          },
          {
            internalType: 'bytes4',
            name: 'originNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'destinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'forwardDestinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'underlyingAssetNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'string',
            name: 'originAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'destinationAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetSymbol',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isForProtocol',
            type: 'bool',
          },
        ],
        internalType: 'struct IPNetworkHub.Operation',
        name: 'operation',
        type: 'tuple',
      },
      {
        internalType: 'bytes32[]',
        name: 'proof',
        type: 'bytes32[]',
      },
    ],
    name: 'protocolGuardianCancelOperation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'originBlockHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'originTransactionHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'optionsMask',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingAssetDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'assetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'networkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'forwardNetworkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'underlyingAssetTokenAddress',
            type: 'address',
          },
          {
            internalType: 'bytes4',
            name: 'originNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'destinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'forwardDestinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'underlyingAssetNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'string',
            name: 'originAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'destinationAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetSymbol',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isForProtocol',
            type: 'bool',
          },
        ],
        internalType: 'struct IPNetworkHub.Operation',
        name: 'operation',
        type: 'tuple',
      },
    ],
    name: 'protocolQueueOperation',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'bytes32',
            name: 'originBlockHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'originTransactionHash',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'optionsMask',
            type: 'bytes32',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'underlyingAssetDecimals',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'assetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'protocolFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'networkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'forwardNetworkFeeAssetAmount',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'underlyingAssetTokenAddress',
            type: 'address',
          },
          {
            internalType: 'bytes4',
            name: 'originNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'destinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'forwardDestinationNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'bytes4',
            name: 'underlyingAssetNetworkId',
            type: 'bytes4',
          },
          {
            internalType: 'string',
            name: 'originAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'destinationAccount',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'underlyingAssetSymbol',
            type: 'string',
          },
          {
            internalType: 'bytes',
            name: 'userData',
            type: 'bytes',
          },
          {
            internalType: 'bool',
            name: 'isForProtocol',
            type: 'bool',
          },
        ],
        internalType: 'struct IPNetworkHub.Operation',
        name: 'operation',
        type: 'tuple',
      },
      {
        internalType: 'bytes32[]',
        name: 'proof',
        type: 'bytes32[]',
      },
    ],
    name: 'protocolSentinelCancelOperation',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'registry',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'actor',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'challenger',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'timestamp',
            type: 'uint64',
          },
        ],
        internalType: 'struct IPNetworkHub.Challenge',
        name: 'challenge',
        type: 'tuple',
      },
    ],
    name: 'slashByChallenge',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'slasher',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'actor',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'challenger',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'timestamp',
            type: 'uint64',
          },
        ],
        internalType: 'struct IPNetworkHub.Challenge',
        name: 'challenge',
        type: 'tuple',
      },
      {
        internalType: 'bytes32[]',
        name: 'proof',
        type: 'bytes32[]',
      },
    ],
    name: 'solveChallengeGuardian',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'actor',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'challenger',
            type: 'address',
          },
          {
            internalType: 'uint64',
            name: 'timestamp',
            type: 'uint64',
          },
        ],
        internalType: 'struct IPNetworkHub.Challenge',
        name: 'challenge',
        type: 'tuple',
      },
      {
        internalType: 'bytes32[]',
        name: 'proof',
        type: 'bytes32[]',
      },
    ],
    name: 'solveChallengeSentinel',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'guardian',
        type: 'address',
      },
      {
        internalType: 'bytes32[]',
        name: 'proof',
        type: 'bytes32[]',
      },
    ],
    name: 'startChallengeGuardian',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sentinel',
        type: 'address',
      },
      {
        internalType: 'bytes32[]',
        name: 'proof',
        type: 'bytes32[]',
      },
    ],
    name: 'startChallengeSentinel',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'telepathyRouter',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'destinationAccount',
        type: 'string',
      },
      {
        internalType: 'bytes4',
        name: 'destinationNetworkId',
        type: 'bytes4',
      },
      {
        internalType: 'string',
        name: 'underlyingAssetName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'underlyingAssetSymbol',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'underlyingAssetDecimals',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'underlyingAssetTokenAddress',
        type: 'address',
      },
      {
        internalType: 'bytes4',
        name: 'underlyingAssetNetworkId',
        type: 'bytes4',
      },
      {
        internalType: 'address',
        name: 'assetTokenAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'assetAmount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'protocolFeeAssetTokenAddress',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'protocolFeeAssetAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'networkFeeAssetAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'forwardNetworkFeeAssetAmount',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'userData',
        type: 'bytes',
      },
      {
        internalType: 'bytes32',
        name: 'optionsMask',
        type: 'bytes32',
      },
    ],
    name: 'userSend',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
