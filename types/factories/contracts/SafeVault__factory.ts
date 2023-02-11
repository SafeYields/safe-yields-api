/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { PromiseOrValue } from "../../common";
import type { SafeVault, SafeVaultInterface } from "../../contracts/SafeVault";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_stableCoin",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "balances",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "deposited",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_stableCoin",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b506040516109fe3803806109fe83398101604081905261002f916100bb565b6100388161003e565b506100eb565b60006100566000805160206109de8339815191525490565b90506001600160a01b038116610083576001600160a01b036000805160206109de83398151915255610098565b336001600160a01b0382161461009857600080fd5b50600080546001600160a01b0319166001600160a01b0392909216919091179055565b6000602082840312156100cd57600080fd5b81516001600160a01b03811681146100e457600080fd5b9392505050565b6108e4806100fa6000396000f3fe608060405234801561001057600080fd5b50600436106100625760003560e01c806318160ddd1461006757806327e235e314610081578063b6b55f25146100a1578063c4d66de8146100b6578063eef49ee3146100c9578063f3fef3a3146100d2575b600080fd5b61006f6100e5565b60405190815260200160405180910390f35b61006f61008f3660046106de565b60026020526000908152604090205481565b6100b46100af366004610700565b610157565b005b6100b46100c43660046106de565b6102ec565b61006f60015481565b6100b46100e0366004610719565b61039a565b600080546040516370a0823160e01b81523060048201526001600160a01b03909116906370a0823190602401602060405180830381865afa15801561012e573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906101529190610743565b905090565b6101896040518060400160405280601181526020017014d8599955985d5b1d0b99195c1bdcda5d607a1b8152506105d5565b600081116101b25760405162461bcd60e51b81526004016101a99061075c565b60405180910390fd5b6101f16040518060400160405280601a81526020017f536166655661756c742e6465706f7369743a205f616d6f756e740000000000008152508261061b565b6102306040518060400160405280601881526020017f536166655661756c742e6465706f7369743a205f75736572000000000000000081525033610660565b336000908152600260205260408120805483929061024f9084906107ba565b92505081905550806001600082825461026891906107ba565b90915550506000546040516323b872dd60e01b8152336004820152306024820152604481018390526001600160a01b03909116906323b872dd906064016020604051808303816000875af11580156102c4573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102e891906107d3565b5050565b60006103167fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d61035490565b90506001600160a01b038116610355576001600160a01b037fb53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d61035561036a565b336001600160a01b0382161461036a57600080fd5b506000805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0392909216919091179055565b6103cd60405180604001604052806012815260200171536166655661756c742e776974686472617760701b8152506105d5565b61040c6040518060400160405280601b81526020017f536166655661756c742e77697468647261773a205f616d6f756e7400000000008152508261061b565b61044b6040518060400160405280601d81526020017f536166655661756c742e77697468647261773a205f726563656976657200000081525083610660565b6104776040518060400160405280600a81526020016936b9b39739b2b73232b960b11b81525033610660565b600081116104975760405162461bcd60e51b81526004016101a99061075c565b3360009081526002602052604090205481111561051c5760405162461bcd60e51b815260206004820152603760248201527f536166655661756c743a20757365722062616c616e6365206973206c6573732060448201527f7468616e20616d6f756e7420746f20776974686472617700000000000000000060648201526084016101a9565b336000908152600260205260408120805483929061053b9084906107f5565b92505081905550806001600082825461055491906107f5565b909155505060005460405163a9059cbb60e01b81526001600160a01b038481166004830152602482018490529091169063a9059cbb906044016020604051808303816000875af11580156105ac573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105d091906107d3565b505050565b610618816040516024016105e9919061084e565b60408051601f198184030181529190526020810180516001600160e01b031663104c13eb60e21b1790526106a1565b50565b6102e88282604051602401610631929190610861565b60408051601f198184030181529190526020810180516001600160e01b0316632d839cb360e21b1790526106a1565b6102e88282604051602401610676929190610883565b60408051601f198184030181529190526020810180516001600160e01b031663319af33360e01b1790525b80516a636f6e736f6c652e6c6f67602083016000808483855afa5050505050565b80356001600160a01b03811681146106d957600080fd5b919050565b6000602082840312156106f057600080fd5b6106f9826106c2565b9392505050565b60006020828403121561071257600080fd5b5035919050565b6000806040838503121561072c57600080fd5b610735836106c2565b946020939093013593505050565b60006020828403121561075557600080fd5b5051919050565b60208082526028908201527f536166655661756c743a20616d6f756e74206d75737420626520677265617465604082015267072207468616e20360c41b606082015260800190565b634e487b7160e01b600052601160045260246000fd5b808201808211156107cd576107cd6107a4565b92915050565b6000602082840312156107e557600080fd5b815180151581146106f957600080fd5b818103818111156107cd576107cd6107a4565b6000815180845260005b8181101561082e57602081850181015186830182015201610812565b506000602082860101526020601f19601f83011685010191505092915050565b6020815260006106f96020830184610808565b6040815260006108746040830185610808565b90508260208301529392505050565b6040815260006108966040830185610808565b90506001600160a01b0383166020830152939250505056fea2646970667358221220c3cc7dbbf88c9d5c127a3979734f97e35d76b48a07fdaed4ae972d35231f306a64736f6c63430008110033b53127684a568b3173ae13b9f8a6016e243e63b6e8ee1178d6a717850b5d6103";

type SafeVaultConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SafeVaultConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SafeVault__factory extends ContractFactory {
  constructor(...args: SafeVaultConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _stableCoin: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<SafeVault> {
    return super.deploy(_stableCoin, overrides || {}) as Promise<SafeVault>;
  }
  override getDeployTransaction(
    _stableCoin: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_stableCoin, overrides || {});
  }
  override attach(address: string): SafeVault {
    return super.attach(address) as SafeVault;
  }
  override connect(signer: Signer): SafeVault__factory {
    return super.connect(signer) as SafeVault__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SafeVaultInterface {
    return new utils.Interface(_abi) as SafeVaultInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): SafeVault {
    return new Contract(address, _abi, signerOrProvider) as SafeVault;
  }
}