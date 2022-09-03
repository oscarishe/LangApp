/* eslint-disable @typescript-eslint/no-shadow */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { checkLogin, } from "../util/util";
import { Navigation } from "./Components/Navigation";
import Pagination from "./Components/Pagination";
import { WordList } from "./Components/WordList/WordList";
import { IAggWord, ITextBookProps, IWord } from "../interfaces/interfaces";
import { fetchAggWords, fetchWords } from "../service/service";
import styles from './Etextbook.module.css'
import { Games } from "./Components/Games/Games";
import { ProgressInfo } from "./Components/ProgressInfo";
import Spinner from 'react-bootstrap/Spinner';
const ETextBook: React.FC<ITextBookProps> = ({children}) => {
    const [words, setWords] = useState<IWord[]>([]);
    const [userWords, setUserWords] = useState<IAggWord[]>([]);
    const params = useParams<{group: string, page:string }>();
    const history = useNavigate();
    const groups = ['0','1','2','3','4','5'];
    const [isAuth, setAuth] = useState(false);
    const [activePage, setActivePage] = useState('0');
    const [progress, setProgress] = useState(0);

    const changePercentage = () => {
        const result = userWords.length / words.length;
        setProgress(result * 100);
    }

    useEffect(() => {
        if(params.group && params.page) {
            fetchWords(params.page || '0', params.group || '0', setWords);
            setActivePage(`textbook__container_${params.group}`);
        }
        else { 
            setActivePage(`textbook__container_dictionary`);
            setWords([]);
            // fetchWords('0','0');
            // history('/textbook/0/0');
        };
    }, [params]);

    useEffect(() => {
        if(checkLogin()) { 
          setAuth(true);
          fetchAggWords(setUserWords, 'all', params.group, params.page);
    }
        else setAuth(false);
    }, [isAuth, params]);

    useEffect(() => {
        changePercentage();
    },[userWords, words])

    const onLeftClick = (page:number) => {
        const newPage = page - 1;
        history(`/textbook/${params.group}/${newPage}`);
    }
    const onRightClick = (page:number) => {
        const newPage = page + 1;
        history(`/textbook/${params.group}/${newPage}`);
    }
    return (
        <div className={styles.textbook__container + ' ' + styles[activePage] }>
            <Navigation groups = {groups} isAuth = {isAuth} />
            {children  ? '' : params.page ? <Pagination 
                onLeftClick = {onLeftClick}
                onRightClick = {onRightClick} 
                page = {params.page?.toString()} /> : ''}
            {children ? '' : isAuth && params.group ? <ProgressInfo progress={progress}/> : ''}
            {words.length === 0 && params.group && <div><Spinner style={{ width: "20rem", height: "20rem", margin:'50px 525px' }} animation="border" /></div>}
            {children ? children :<WordList setUserWords = {setUserWords} userWords={userWords} data={words} isAuth = {isAuth} />}
            {children ? '' : params.group ? <Games percentage={progress} /> : ''}          
        </div>
    )
}

export default ETextBook;