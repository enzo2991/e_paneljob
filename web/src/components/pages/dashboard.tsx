import moment from "moment"
import { fetchNui } from "../../utils/fetchNui"
import { useEffect, useState } from "react"

interface stashBankEntry {
    amount: number;
    label: string;
    action: string;
    date: string;
}

const dashboard = () => {
    const [moneyJob, setMoneyJob] = useState<number>(0);
    const [playerInJob, setplayerInJob] = useState<number>(0);
    const [timeInJob, setTimeInJob] = useState<number>(0);
    const [accountJob, setAccountJob] = useState<string>('.......');
    const [stashBank, setstashBank] = useState<stashBankEntry[]>([]);

    useEffect(() => {
        async function fetchData() {
            const data: { money:number, inJob:number, minuteInJob:number, account:string, dataBank:stashBankEntry[] } = await fetchNui("getDashboardData")
            setMoneyJob(data.money)
            setAccountJob(data.account)
            setplayerInJob(data.inJob)
            setTimeInJob(data.minuteInJob)
            setstashBank(data.dataBank || [])
        }
        fetchData()
    },[])

    return (
        <div className="flex flex-col w-3/4">
            <h1 className="self-center text-2xl font-bold mt-1">Dashboard</h1>
            <div className="flex flex-col gap-3 w-full h-full my-4 rounded-xl">
                <div className="mt-4 w-full">
                    <div className="grid items-center gap-y-10 gap-x-6 md:grid-cols-3 xl:grid-cols-3">
                        <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                            <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-blue-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-6 h-6 text-white">
                                    <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"></path>
                                    <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd"></path>
                                    <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z"></path>
                                </svg>
                            </div>
                            <div className="p-4 text-right">
                                <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">Compte Entreprise</p>
                                <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{moneyJob} $</h4>
                                <p className="block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600">{accountJob}</p>
                            </div>
                        </div>
                        <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                            <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-pink-600 to-pink-400 text-white shadow-pink-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-6 h-6 text-white">
                                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd"></path>
                                </svg>
                            </div>
                            <div className="p-4 text-right">
                                <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">Nombre d'employé(s)</p>
                                <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{playerInJob}</h4>
                            </div>
                        </div>
                        <div className="relative flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 shadow-md">
                            <div className="bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-orange-600 to-orange-400 text-white shadow-orange-500/40 shadow-lg absolute -mt-4 grid h-16 w-16 place-items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-6 h-6 text-white">
                                    <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z"></path>
                                </svg>
                            </div>
                            <div className="p-4 text-right">
                                <p className="block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600">Minute(s) pointé</p>
                                <h4 className="block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900">{timeInJob}</h4>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-full bg-white rounded-xl shadow-md ">
                    <h6 className="font-sans text-base font-semibold leading-relaxed text-blue-gray-900 text-gray-700 shadow-none m-6">Historique bancaire</h6>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="table w-full table-fixed">
                                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                                        <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">date</p>
                                    </th>
                                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                                        <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">label</p>
                                    </th>
                                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                                        <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">montant</p>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="block max-h-96 overflow-y-auto">
                                {stashBank.map((entry, index) =>{
                                    const isWithdrawal = entry.action.toLowerCase().includes('withdraw');;
                                    const formattedAmount = isWithdrawal ? `- ${Math.abs(entry.amount)} $` : `${entry.amount} $`;
                                    const amountClass = isWithdrawal ? 'text-red-500' : 'text-green-400'
                                    return (
                                        <tr key={index} className="table w-full table-fixed">
                                            <td className="py-3 px-5 border-b border-blue-gray-50">
                                                <p className="antialiased font-sans text-xs font-medium text-blue-gray-600">{moment(new Date(Number(entry.date)*1000)).format("DD-MM-YYYY HH:mm:ss")}</p>
                                            </td>
                                            <td className="py-3 px-5 border-b border-blue-gray-50">
                                                <p className="antialiased font-sans text-xs font-medium text-blue-gray-600">{entry.label}</p>
                                            </td>
                                            <td className="py-3 px-5 border-b border-blue-gray-50">
                                            <p className={`antialiased font-sans text-xs font-medium ${amountClass}`}>{formattedAmount}</p>
                                        </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default dashboard