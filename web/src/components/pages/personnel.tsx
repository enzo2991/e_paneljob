
import { useState, useEffect } from "react";
import { fetchNui } from "../../utils/fetchNui";
import { usePageContext } from '../interface/index'

interface gradeEntry {
    name: string,
    number: number
}

interface personnelEntry {
    identifier: string,
    firstname: string,
    lastname: string,
    grade:gradeEntry,
    time:number
}

const personnel = () => {
    const { userPermissions } = usePageContext();
    const [selectedRow, setSelectedRow] = useState<number | null>(null);
    const [isBoss, setIsBoss] = useState<boolean>(false);
    const [islastGrade, setIslastGrade] = useState<boolean>(false);
    const [personnel, setPersonnel] = useState<personnelEntry[]>([])
    const [selectedPersonnel, setSelectedPersonnel] = useState<personnelEntry | null>(null)

    const handleRowClick = (index: number) => {
        const newIndex = selectedRow === index ? null : index
        setSelectedRow(newIndex);
        if(newIndex !== null){
            const selectedEntry = personnel[newIndex]
            setSelectedPersonnel(selectedEntry)
            setIslastGrade(selectedEntry.grade.number === 0 ? true : false)
            setIsBoss(selectedEntry.grade.name === "boss")
        }else {
            setSelectedPersonnel(null)
            setIslastGrade(false)
            setIsBoss(false)
        }
    };

    const handleButtonClick = (action:string) => {
        if (selectedRow !== null) {
            switch(action){
                default:
                    console.log(`Action: ${action}, Index: ${selectedRow}`)
                    break;
            }
        }
    }

    useEffect(() => {
        async function fetchPersonnel() {
          const data: personnelEntry[] = await fetchNui("getPersonnel");
          setPersonnel(data || []);
        }
        fetchPersonnel();
      }, []);

    return (
        <div className="flex flex-col w-3/4">
            <h1 className="self-center text-2xl font-bold">Personnel</h1>
            <div className="flex flex-row gap-3 w-full h-full my-4 rounded-xl">
                <div className="flex flex-col w-1/2 h-full bg-clip-border rounded-xl bg-white shadow-md">
                    <div className="bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-6">
                        <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900">Listes du personnel</h6>
                    </div>
                    <table className="w-full table-auto">
                        <thead>
                            <tr>
                                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                                    <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">Nom</p>
                                </th>
                                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                                    <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">Prenom</p>
                                </th>
                                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                                    <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">Grade</p>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                        {personnel.map((data,index) => (
                            <tr key={index} onClick={() => handleRowClick(index)} className={selectedRow === index ? "bg-gray-200" : ""}>
                                <td className="py-3 px-5 border-b border-blue-gray-50">
                                    <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600">{data.firstname}</p>
                                </td>
                                <td className="py-3 px-5 border-b border-blue-gray-50">
                                    <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600">{data.lastname}</p>
                                </td>
                                <td className="py-3 px-5 border-b border-blue-gray-50">
                                    <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600">{data.grade.name}</p>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className={`flex flex-col w-1/2 h-full gap-3 transition-opacity duration-500 ${selectedRow !== null ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    {selectedPersonnel && (
                        <div className="h-1/2 bg-clip-border rounded-xl bg-white shadow-md mb-5">
                            <div className="bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none ml-4 mt-2 flex items-center justify-between">
                                <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900 ">Information</h6>
                            </div>
                            
                                <div className="flex flex-col mx-4 h-4/6 gap-3 mb-2">
                                    <div>
                                        <p className="font-bold">Id:</p>
                                        <p>{selectedPersonnel.identifier}</p>
                                    </div>
                                    <div>
                                        <p className="font-bold">Nom:</p>
                                        <p>{selectedPersonnel.lastname}</p>
                                    </div>
                                    <div>
                                        <p className="font-bold">Prenom:</p>
                                        <p>{selectedPersonnel.firstname}</p>
                                    </div>
                                    <div>
                                        <p className="font-bold">Grade:</p>
                                        <p>{selectedPersonnel.grade.name}</p>
                                    </div>
                                    <div>
                                        <p className="font-bold">Nombre de minutes:</p>
                                        <p>{selectedPersonnel.time}</p>
                                    </div>
                                </div>
                        </div>
                    )}
                    {selectedPersonnel && (
                        <div className="h-1/2 bg-clip-border rounded-xl bg-white shadow-md">
                            <div className="bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none ml-4 mt-2 flex items-center justify-between">
                                <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900">Action</h6>
                            </div>
                            <div className="flex mx-4 h-4/6 items-center justify-around gap-3">
                                {userPermissions.includes('perso.Promote')  && (
                                    <button onClick={()=> handleButtonClick('promote')} className={`rounded-md w-1/2 h-1/2 bg-green-500 text-white font-sans text-base font-semibold shadow-md shadow-green-500/20 transition-all ${isBoss ? 'opacity-0 pointer-events-none' : 'opacity-100'}  hover:shadow-lg hover:shadow-green-500/40`}>Promouvoir</button>
                                )}
                                {userPermissions.includes('perso.Demote') && !islastGrade && (
                                    <button onClick={()=> handleButtonClick('demote')} className="rounded-md w-1/2 h-1/2 bg-orange-500 text-white font-sans text-base font-semibold shadow-md shadow-orange-500/20 transition-all hover:shadow-lg hover:shadow-orange-500/40">Rétrograder</button>
                                )}
                                {userPermissions.includes('perso.Layoff') && (
                                    <button onClick={()=> handleButtonClick('layoff')} className="rounded-md w-1/2 h-1/2 bg-red-500 text-white font-sans text-base font-semibold shadow-md shadow-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/40">Licencier</button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
    </div>
    )
}

export default personnel