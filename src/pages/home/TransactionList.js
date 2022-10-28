import { useFirestore } from '../../hooks/useFiretore'
import styles from './Home.module.css'

export default function TransactionList({transactions}) {
  const { deleteDoc, response } = useFirestore('transactions')
  console.log(response)

  return (
    <ul className={styles.transactions}>
        {transactions.map((transaction) => (
            <li key={transaction.id}>
                <p className={styles.name}>{transaction.name}</p>
                <p className={styles.amount}>${transaction.amount}</p>
                <button onClick={() => deleteDoc(transaction.id)}>X</button>
            </li>
        ))}
    </ul>
  )
}
