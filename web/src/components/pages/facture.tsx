
import moment from "moment"
import { useEffect, useState } from "react"
import { fetchNui } from "../../utils/fetchNui"

interface billingEntry {
    timestamp:number,
    recipient_label:string,
    summary:string,
    status:string,
    amount:number
}


const facture = () => {
    const [billing,setBilling] = useState<billingEntry[]>([])

    useEffect(() => {
        async function fetchData() {
            const data: { billings:billingEntry[] } = await fetchNui("getFactureData")
            setBilling(data.billings || [])
        }
        fetchData()
    },[])

    return (
        <div className="w-4/6 flex flex-col mr-4 gap-4">
            <h1 className="self-center text-2xl font-bold mt-1">Facture(s)</h1>
            <div className="mb-4 h-full bg-white rounded-xl shadow-md ">
                <h6 className="font-sans text-base font-semibold leading-relaxed text-blue-gray-900 text-gray-700 shadow-none m-6">Historique des factures</h6>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="table w-full table-fixed">
                                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                                    <p className="antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">Date</p>
                                </th>
                                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                                    <p className="antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">Destinataire</p>
                                </th>
                                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                                    <p className="antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">résumé</p>
                                </th>
                                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                                    <p className="antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">Montant</p>
                                </th>
                                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                                    <p className="antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">Etat</p>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="block max-h-[33rem] overflow-y-auto">
                            {billing.map((entry,index) => {
                                const isPending = entry.status.toLowerCase().includes('pending');
                                const billingStatus = isPending ? 'Impayé' : 'Payé'
                                const billingStatusClass = isPending ? 'text-red-400' : 'text-green-400'
                                return(
                                    <tr key={index} className="table w-full table-fixed">
                                        <td className="py-3 px-5 border-b border-blue-gray-50">
                                            <p className="antialiased font-sans text-xs font-medium text-blue-gray-600">{moment(entry.timestamp).format("DD-MM-YYYY HH:mm:ss")}</p>
                                        </td>
                                        <td className="py-3 px-5 border-b border-blue-gray-50">
                                            <p className="antialiased font-sans text-xs font-medium text-blue-gray-600">{entry.recipient_label}</p>
                                        </td>
                                        <td className="py-3 px-5 border-b border-blue-gray-50">
                                            <p className="antialiased font-sans text-xs font-medium text-blue-gray-600">{entry.summary}</p>
                                        </td>
                                        <td className="py-3 px-5 border-b border-blue-gray-50">
                                            <p className="antialiased font-sans text-xs font-medium text-blue-gray-600">{entry.amount} $</p>
                                        </td>
                                        <td className="py-3 px-5 border-b border-blue-gray-50">
                                            <p className={`antialiased font-sans text-xs font-medium ${billingStatusClass}`}>{billingStatus}</p>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default facture