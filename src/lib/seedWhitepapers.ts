export type SeedWhitepaper = {
  id: string
  title: string
  author: string
  year: number
  tier: 1 | 2 | 3 | 4
  slug: string
  description: string
  pdf_url: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  unlocked_by_default: boolean
  sections: { title: string; content: string }[]
}

export const seedWhitepapers: SeedWhitepaper[] = [
  {
    id: 'wp-bitcoin',
    title: 'Bitcoin: A Peer-to-Peer Electronic Cash System',
    author: 'Satoshi Nakamoto',
    year: 2008,
    tier: 1,
    slug: 'bitcoin',
    description:
      'The original paper that started it all. 9 pages. Explains the double-spend problem and how a decentralised chain of blocks solves it.',
    pdf_url: 'https://bitcoin.org/bitcoin.pdf',
    difficulty: 'beginner',
    unlocked_by_default: true,
    sections: [
      {
        title: '1. Introduction',
        content:
          'Commerce on the Internet has come to rely almost exclusively on financial institutions serving as trusted third parties to process electronic payments. While the system works well enough for most transactions, it still suffers from the inherent weaknesses of the trust based model. Completely non-reversible transactions are not really possible, since financial institutions cannot avoid mediating disputes.\n\nWhat is needed is an electronic payment system based on cryptographic proof instead of trust, allowing any two willing parties to transact directly with each other without the need for a trusted third party. Transactions that are computationally impractical to reverse would protect sellers from fraud, and routine escrow mechanisms could easily be implemented to protect buyers.',
      },
      {
        title: '2. Transactions',
        content:
          'We define an electronic coin as a chain of digital signatures. Each owner transfers the coin to the next by digitally signing a hash of the previous transaction and the public key of the next owner and adding these to the end of the coin. A payee can verify the signatures to verify the chain of ownership.\n\nThe problem of course is the payee cannot verify that one of the owners did not double-spend the coin. A common solution is to introduce a trusted central authority, or mint, that checks every transaction for double spending. We need a way for the payee to know that the previous owners did not sign any earlier transactions.',
      },
      {
        title: '3. Timestamp Server',
        content:
          'The solution we propose begins with a timestamp server. A timestamp server works by taking a hash of a block of items to be timestamped and widely publishing the hash, such as in a newspaper or Usenet post. The timestamp proves that the data must have existed at the time, obviously, in order to get into the hash. Each timestamp includes the previous timestamp in its hash, forming a chain, with each additional timestamp reinforcing the ones before it.',
      },
      {
        title: '4. Proof-of-Work',
        content:
          'To implement a distributed timestamp server on a peer-to-peer basis, we will need to use a proof-of-work system similar to Adam Back\'s Hashcash, rather than newspaper or Usenet posts. The proof-of-work involves scanning for a value that when hashed, such as with SHA-256, the hash begins with a number of zero bits. The average work required is exponential in the number of zero bits required and can be verified by executing a single hash.\n\nFor our timestamp network, we implement the proof-of-work by incrementing a nonce in the block until a value is found that gives the block\'s hash the required zero bits. Once the CPU effort has been expended to make it satisfy the proof-of-work, the block cannot be changed without redoing the work.',
      },
      {
        title: '5. Network',
        content:
          'The steps to run the network are as follows: 1) New transactions are broadcast to all nodes. 2) Each node collects new transactions into a block. 3) Each node works on finding a difficult proof-of-work for its block. 4) When a node finds a proof-of-work, it broadcasts the block to all nodes. 5) Nodes accept the block only if all transactions in it are valid and not already spent. 6) Nodes express their acceptance of the block by working on creating the next block in the chain, using the hash of the accepted block as the previous hash.\n\nNodes always consider the longest chain to be the correct one and will keep working on extending it.',
      },
      {
        title: '6. Incentive',
        content:
          'By convention, the first transaction in a block is a special transaction that starts a new coin owned by the creator of the block. This adds an incentive for nodes to support the network, and provides a way to initially distribute coins into circulation, since there is no central authority to issue them.\n\nOnce a predetermined number of coins have entered circulation, the incentive can transition entirely to transaction fees and be completely inflation free. The incentive may help encourage nodes to stay honest.',
      },
      {
        title: '8. Simplified Payment Verification',
        content:
          "It is possible to verify payments without running a full network node. A user only needs to keep a copy of the block headers of the longest proof-of-work chain, which he can get by querying network nodes until he's convinced he has the longest chain, and obtain the Merkle branch linking the transaction to the block it's timestamped in.",
      },
      {
        title: '11. Calculations',
        content:
          "We consider the scenario of an attacker trying to generate an alternate chain faster than the honest chain. Even if this is accomplished, it does not throw the system open to arbitrary changes, such as creating value out of thin air or taking money that never belonged to the attacker. Nodes are not going to accept an invalid transaction as payment, and honest nodes will never accept a block containing them.\n\nThe race between the honest chain and an attacker chain can be characterized as a Binomial Random Walk. The success event is the honest chain being extended by one block, increasing its lead by +1, and the failure event is the attacker's chain being extended by one block, reducing the gap by -1.",
      },
    ],
  },
  {
    id: 'wp-ethereum',
    title: 'Ethereum: A Next-Generation Smart Contract and Decentralised Application Platform',
    author: 'Vitalik Buterin',
    year: 2013,
    tier: 2,
    slug: 'ethereum',
    description:
      "Vitalik's original vision for a programmable blockchain. Introduces smart contracts, the EVM, and gas.",
    pdf_url:
      'https://ethereum.org/content/whitepaper/whitepaper-pdf/Ethereum_White_Paper_-_Buterin_2014.pdf',
    difficulty: 'intermediate',
    unlocked_by_default: false,
    sections: [
      {
        title: 'Introduction to Bitcoin and Existing Concepts',
        content:
          "The concept of decentralized digital currency, as well as alternative applications like property registries, has been around for decades. The anonymous e-cash protocols of the 1980s and the 1990s were mostly reliant on a cryptographic primitive known as Chaumian blinding. Bitcoin's innovation was the use of a simple and moderately effective consensus algorithm based on nodes combining transactions into blocks and publishing a chain.",
      },
      {
        title: 'Ethereum Accounts',
        content:
          'In Ethereum, the state is made up of objects called "accounts", with each account having a 20-byte address and state transitions being direct transfers of value and information between accounts. An Ethereum account contains four fields: the nonce (counter to prevent transaction replays), the account\'s current ether balance, the account\'s contract code (if present), and the account\'s storage (empty by default).\n\nThere are two types of accounts: externally owned accounts controlled by private keys, and contract accounts controlled by their contract code.',
      },
      {
        title: 'Messages and Transactions',
        content:
          "The term 'transaction' is used in Ethereum to refer to the signed data package that stores a message to be sent from an externally owned account. Transactions contain the recipient, a signature, amount of ether, data field, STARTGAS value, and GASPRICE value.\n\nThe STARTGAS and GASPRICE fields are crucial for Ethereum's anti-denial of service model. In order to prevent accidental or hostile infinite loops or other computational wastage in code, each transaction is required to set a limit to how many computational steps of code execution it can use.",
      },
      {
        title: 'Ethereum State Transition Function',
        content:
          'The Ethereum state transition function, APPLY(S,TX) -> S\', can be defined as follows: Check if the transaction is well-formed, the signature is valid, and the nonce matches the sender account\'s nonce. Calculate the transaction fee, subtract and increment the sender\'s nonce. Initialize gas, subtract the fee upfront. Transfer the transaction value to the recipient account.\n\nIf the receiving account is a contract, run the contract\'s code either to completion or until the execution runs out of gas.',
      },
      {
        title: 'Code Execution',
        content:
          "The code in Ethereum contracts is written in a low-level, stack-based bytecode language, referred to as 'Ethereum virtual machine code' or 'EVM code'. The code consists of a series of bytes, where each byte represents an operation. In general, code execution is an infinite loop that consists of repeatedly carrying out the operation at the current program counter (which begins at zero) and then incrementing the program counter by one.",
      },
      {
        title: 'Applications: Decentralized Autonomous Organizations',
        content:
          'The general concept of a "decentralized autonomous organization" is that of a virtual entity that has a certain set of members or shareholders which, perhaps with a 67% majority, have the right to spend the entity\'s funds and modify its code. The members would collectively decide on how the organization should allocate its funds.\n\nAn ideal DAO would be a virtual entity that contains no trusted humans at all — using a combination of smart contracts and cryptographic mechanisms to handle all decision-making and asset management.',
      },
    ],
  },
  {
    id: 'wp-uniswap-v2',
    title: 'Uniswap v2 Core',
    author: 'Hayden Adams, Noah Zinsmeister, Dan Robinson',
    year: 2020,
    tier: 3,
    slug: 'uniswap-v2',
    description:
      'How automated market makers (AMMs) work. Explains the constant product formula and how liquidity pools replace order books.',
    pdf_url: 'https://uniswap.org/whitepaper.pdf',
    difficulty: 'intermediate',
    unlocked_by_default: false,
    sections: [
      {
        title: 'Abstract',
        content:
          'This technical whitepaper describes Uniswap v2, a protocol for decentralized exchange of ERC-20 tokens on the Ethereum blockchain. Uniswap v2 builds on the original Uniswap design, supporting ERC20/ERC20 pairs, price oracles, flash swaps, and other features. The core contracts are minimal, non-upgradable, and not subject to centralized control.',
      },
      {
        title: 'Constant Product Formula',
        content:
          'Uniswap v1 used the constant product formula x * y = k, where x and y represent the reserves of two tokens, and k is a constant. This formula ensures that no matter how much of one token is traded, the product of the reserves remains the same. The price of one token in terms of the other is determined by the ratio of reserves.\n\nUniswap v2 maintains this core mechanism while introducing significant improvements to the architecture and adding support for ERC20/ERC20 pairs instead of only ETH/ERC20 pairs.',
      },
      {
        title: 'ERC20/ERC20 Pairs',
        content:
          'Uniswap v1 used ETH as a bridge currency. Every ERC20 token had a pair with ETH, and to trade between two ERC20 tokens, the protocol would route through ETH: ERC20a -> ETH -> ERC20b.\n\nUniswap v2 allows the creation of direct ERC20/ERC20 pairs. This approach reduces slippage and gas costs for many trades. It also allows the creation of pairs involving tokens that may not have liquidity against ETH.',
      },
      {
        title: 'Price Oracles',
        content:
          'The price determined by Uniswap is often a useful approximation for the true market price of an asset. However, this price can be manipulated over the course of a single transaction or block.\n\nUniswap v2 includes price oracle functionality that allows other contracts to measure the time-weighted average price (TWAP) of a token pair over a specified period. This TWAP is much more expensive to manipulate than a spot price, because an attacker would need to move and hold the price for an extended period.',
      },
      {
        title: 'Flash Swaps',
        content:
          "Uniswap v2 allows users to withdraw any amount of ERC20 tokens from the pool, as long as the tokens (or their equivalent value) are returned by the end of the transaction. This 'flash swap' functionality is useful for arbitrage, liquidations, and other advanced DeFi strategies.\n\nIf a user doesn't return the tokens plus a fee, the entire transaction reverts. This atomic guarantee makes flash swaps safe for liquidity providers.",
      },
    ],
  },
  {
    id: 'wp-lightning',
    title: 'The Bitcoin Lightning Network',
    author: 'Joseph Poon & Thaddeus Dryja',
    year: 2016,
    tier: 3,
    slug: 'lightning-network',
    description:
      "Bitcoin's Layer 2 scaling solution. Explains payment channels and how to route payments off-chain.",
    pdf_url: 'https://lightning.network/lightning-network-paper.pdf',
    difficulty: 'advanced',
    unlocked_by_default: false,
    sections: [
      {
        title: 'Abstract',
        content:
          'The bitcoin protocol can encompass the global financial transaction volume in all electronic payment systems today, without a single custodial third party holding funds or requiring participants to have anything more than a computer using a broadband connection. A decentralized system is proposed whereby transactions are sent over a network of micropayment channels whose transfer of value occurs off-blockchain.',
      },
      {
        title: 'The Problem with On-Chain Micropayments',
        content:
          "Bitcoin's current blockchain cannot handle the volume of transactions required for global adoption. Each transaction requires block confirmation, which takes approximately 10 minutes on average. With a block size limit, the network can process only a limited number of transactions per second.\n\nFor micropayments — tiny payments of fractions of a cent — the on-chain fee alone often exceeds the payment value. This makes Bitcoin impractical for everyday small purchases without a second-layer solution.",
      },
      {
        title: 'Payment Channels',
        content:
          "A payment channel is a method by which two parties can make multiple Bitcoin transactions without committing all of them to the blockchain. Only the opening and closing transactions need to be broadcast to the blockchain — all payments in between are signed by both parties but not published.\n\nFor example, Alice and Bob can open a channel with 1 BTC. As they transact back and forth, they update their private balance sheets. When they're done, they close the channel and only the final state is recorded on-chain, regardless of how many micropayments occurred.",
      },
      {
        title: 'Hash Time-Locked Contracts (HTLCs)',
        content:
          'Hash Time-Locked Contracts (HTLCs) allow secure routing across multiple payment channels. The key insight: Alice wants to pay Carol via Bob. Bob will not forward payment unless he is guaranteed to receive it back. With HTLCs, Alice creates a cryptographic hash and Carol provides the preimage. Payments are locked behind this hash — Bob cannot keep the payment without forwarding it, and all payments either complete atomically or refund automatically.',
      },
    ],
  },
  {
    id: 'wp-smart-contract-security',
    title: 'Smart Contract Security Analysis',
    author: 'Ethereum Foundation',
    year: 2016,
    tier: 3,
    slug: 'smart-contract-security',
    description:
      'A foundational analysis of smart contract design patterns and important considerations when building on-chain applications.',
    pdf_url:
      'https://blog.ethereum.org/2016/06/19/thinking-about-smart-contract-security',
    difficulty: 'intermediate',
    unlocked_by_default: false,
    sections: [
      {
        title: 'Introduction to Smart Contract Safety',
        content:
          'Smart contracts are immutable programs that handle real financial value. Unlike traditional software, bugs cannot be patched after deployment without significant coordination. A single flaw in a smart contract can result in permanent loss of funds.\n\nThe engineering discipline for smart contracts therefore requires a significantly higher bar for correctness than most software. Developers must account for adversarial conditions, unexpected inputs, and the unique execution environment of the Ethereum blockchain.',
      },
      {
        title: 'Reentrancy',
        content:
          "One of the most important considerations in smart contract design is the order of operations. A contract that sends funds before updating its own state can be re-entered before the state update occurs.\n\nThe pattern to avoid: check a condition, send funds, then update state. The safe pattern: check a condition, update state, then send funds. Following the checks-effects-interactions pattern ensures that any re-entrant calls encounter the already-updated state.",
      },
      {
        title: 'Integer Overflow and Underflow',
        content:
          "Solidity integers have fixed sizes. An unsigned 8-bit integer (uint8) can hold values from 0 to 255. If you add 1 to 255, the result wraps around to 0. This 'overflow' behavior can lead to serious issues in token contracts or financial logic.\n\nModern Solidity (0.8.0+) includes built-in overflow protection that reverts on overflow. For older contracts, the SafeMath library was the standard solution.",
      },
      {
        title: 'Access Control Patterns',
        content:
          "Many smart contract vulnerabilities stem from missing or incorrect access controls. A function that should only be callable by the contract owner being callable by anyone is a common class of problem.\n\nThe most common pattern is the Ownable pattern: store the deployer's address, and use a modifier to restrict sensitive functions to that address only. More sophisticated access control uses role-based systems where different addresses have different permissions.",
      },
    ],
  },
  {
    id: 'wp-zerocash',
    title: 'Zerocash: Decentralised Anonymous Payments',
    author: 'Eli Ben-Sasson, Alessandro Chiesa, Christina Garman, Matthew Green, Ian Miers, Eran Tromer, Madars Virza',
    year: 2014,
    tier: 4,
    slug: 'zerocash',
    description:
      'The foundational paper for ZK-proof based privacy on blockchains. The cryptographic origin of Zcash.',
    pdf_url: 'https://eprint.iacr.org/2014/349.pdf',
    difficulty: 'advanced',
    unlocked_by_default: false,
    sections: [
      {
        title: 'Abstract',
        content:
          "Bitcoin is the first decentralized digital currency, but it is not anonymous. Transaction amounts and sender and recipient addresses are publicly visible in Bitcoin's blockchain. This lack of privacy is a significant limitation for many use cases.\n\nThis paper introduces Zerocash, a protocol that uses zero-knowledge proofs to enable fully private transactions. Zerocash allows users to make payments that conceal the payment's origin, destination, and amount.",
      },
      {
        title: 'Zero-Knowledge Proofs',
        content:
          "A zero-knowledge proof is a cryptographic method by which one party (the prover) can prove to another party (the verifier) that a statement is true, without conveying any information beyond the truth of that statement.\n\nFor example: a prover can demonstrate they know a secret number without revealing what that number is. In Zerocash, this is used to prove 'I am spending a valid coin that I own' without revealing which coin it is, who owned it before, or the amount.",
      },
      {
        title: 'zk-SNARKs',
        content:
          'Zerocash uses a specific type of zero-knowledge proof called a zk-SNARK (Zero-Knowledge Succinct Non-Interactive Argument of Knowledge). zk-SNARKs are "succinct" meaning the proof is small and quick to verify, even if the underlying computation is complex.\n\nThe key properties: Completeness (an honest prover can always prove true statements), Soundness (a dishonest prover cannot prove false statements), Zero-knowledge (the verifier learns nothing beyond the statement\'s truth).',
      },
      {
        title: 'The Zerocash Construction',
        content:
          'In Zerocash, coins are represented as commitments stored in a Merkle tree on the public ledger. To spend a coin, the sender creates a zero-knowledge proof demonstrating knowledge of a valid opening of a commitment in the tree, without revealing which commitment.\n\nThe proof also demonstrates that the new output coins have the correct value and that no value is created out of thin air — without revealing any of the actual values involved.',
      },
    ],
  },
]

// Map from glossary term slugs to related whitepaper slugs (for "From the Whitepaper" tab)
export const termToWhitepaperMap: Record<string, string> = {
  bitcoin: 'bitcoin',
  blockchain: 'bitcoin',
  'proof-of-work': 'bitcoin',
  mining: 'bitcoin',
  'merkle-tree': 'bitcoin',
  'double-spend': 'bitcoin',
  ethereum: 'ethereum',
  'smart-contract': 'ethereum',
  gas: 'ethereum',
  'gas-fee': 'ethereum',
  evm: 'ethereum',
  solidity: 'ethereum',
  dao: 'ethereum',
  defi: 'uniswap-v2',
  amm: 'uniswap-v2',
  'liquidity-pool': 'uniswap-v2',
  'layer-2': 'lightning-network',
  'payment-channel': 'lightning-network',
  'zero-knowledge': 'zerocash',
  'zk-proof': 'zerocash',
}

export const tierColors: Record<number, { text: string; bg: string; border: string; badge: string }> = {
  1: { text: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', badge: 'Tier 1 · Foundations' },
  2: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', badge: 'Tier 2 · Smart Contracts' },
  3: { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', badge: 'Tier 3 · DeFi & Scaling' },
  4: { text: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', badge: 'Tier 4 · Frontier' },
}

export const difficultyColors: Record<string, string> = {
  beginner: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  intermediate: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  advanced: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
}

// localStorage helpers for whitepaper progress
export type WPProgressEntry = {
  level: 'surface' | 'structural' | 'deep' | 'mastery'
  unlocked: boolean
  surface_score: number
  structural_score: number
  deep_score: number
  mastery_score: number
  last_read?: string
}

export type WPProgressMap = Record<string, WPProgressEntry>

const WP_PROGRESS_KEY = 'w3m_wp_progress'
const WP_UNLOCKED_KEY = 'w3m_wp_unlocked'

export function getWPProgress(): WPProgressMap {
  try {
    return JSON.parse(localStorage.getItem(WP_PROGRESS_KEY) || '{}')
  } catch {
    return {}
  }
}

export function setWPProgress(slug: string, entry: Partial<WPProgressEntry>) {
  const current = getWPProgress()
  current[slug] = { ...current[slug], ...entry }
  localStorage.setItem(WP_PROGRESS_KEY, JSON.stringify(current))
}

export function getUnlockedWhitepapers(): string[] {
  try {
    const stored = JSON.parse(localStorage.getItem(WP_UNLOCKED_KEY) || '[]') as string[]
    // Bitcoin is always unlocked
    if (!stored.includes('bitcoin')) stored.push('bitcoin')
    return stored
  } catch {
    return ['bitcoin']
  }
}

export function unlockWhitepaper(slug: string) {
  const current = getUnlockedWhitepapers()
  if (!current.includes(slug)) {
    current.push(slug)
    localStorage.setItem(WP_UNLOCKED_KEY, JSON.stringify(current))
  }
  setWPProgress(slug, { unlocked: true })
}

export function isWhitepaperUnlocked(slug: string): boolean {
  const wp = seedWhitepapers.find((w) => w.slug === slug)
  if (wp?.unlocked_by_default) return true
  return getUnlockedWhitepapers().includes(slug)
}
