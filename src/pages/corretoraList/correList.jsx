import CorreListTable from "../../components/CorreList/CorreListTable"
import { useState, useEffect } from 'react';

function CorreList({isOpen, setIsOpen, selecionar, corretorasList}){


    const closeModal = () => {
        setIsOpen(false);
    };
        
    const corretora = 
        {
            id: '',
            nome: '',
            nomefan: '',
            cidade: '',
            estado: '',
            endereco: '',
            cnpj: '',
            email: '',
            telefone: '',
            susep: '',
            impCorretora: '',   
        }
    
    const [corretoras, setcorretoras] = useState([]);
    const [objCorretora, setobjCorretora] = useState(corretora);

    useEffect(() => {
        fetch('http://localhost:8080/corretora')
        .then(response => response.json())
        .then(data => setcorretoras(data));
    }, []);

    if(!isOpen) return null;

    return(
        
        <div className="CorreList">
            
            <CorreListTable vetor={corretorasList} selecionar={selecionar} closeModal={closeModal} />
        </div>
    );
    
}
export default CorreList;