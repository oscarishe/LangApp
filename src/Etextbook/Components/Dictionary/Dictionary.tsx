import { useEffect, useState } from "react"
import { deleteWord, fetchAggWords} from "../../../service/service";
import styles from "../../Etextbook.module.css"
import { DictionaryItem } from "./DictionaryItem";
import { IAggWord} from "../../../interfaces/interfaces";


export const Dictionary = () => {
    const [userWords, setUserWords] = useState<IAggWord[]>([]);

    async function updateArray(wordId:string) {
        const newArray = userWords.filter(item => item._id !== wordId);
        await deleteWord(wordId);
        setUserWords(newArray);
    }

    useEffect(() => {
        fetchAggWords(setUserWords, 'hard');
    },[]);

    return (
        <div>
            <h2 className={styles.dictionary__header}>Всего сложных слов: {userWords.length}</h2>
        <div className={styles.word_container}>
            {userWords.map(word => <DictionaryItem updateArray={updateArray} data={word} key ={word._id} />)}
        </div>
        </div>
    )

}