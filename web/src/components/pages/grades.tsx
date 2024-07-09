import { useState, useEffect } from "react";
import { fetchNui } from "../../utils/fetchNui";
import { usePageContext } from '../interface/index'
import { SubmitHandler, useForm } from "react-hook-form";
import useNuiEvent from '../../hooks/useNuiEvent';

interface listpermsEntry {
  key: string;
  label: string;
  state: boolean;
}

interface gradesEntry {
  grade: number;
  name: string;
  label: string;
  salary: number;
}

interface FormValue {
  action: string;
  name: string;
  label: string;
  salary: string;
}

const grades = () => {
  const { register, handleSubmit: rhfHandleSubmit, setValue } = useForm<FormValue>();
  const { userPermissions } = usePageContext();
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedPerm, setSelectedPerm] = useState<number | null>(null);
  const [isBoss, setIsBoss] = useState<boolean>(false);
  const [firstIndex, setFirstIndex] = useState<boolean>(false);
  const [dataPerms, setDataPerms] = useState<listpermsEntry[]>([]);
  const [grades, setGrades] = useState<gradesEntry[]>([]);

  const handleGradeClick = async (index: number) => {
    const newIndex = selectedGrade === index ? null : index;
    setSelectedGrade(newIndex);
    if (newIndex !== null) {
      const selected = grades[newIndex];
      setFirstIndex(newIndex === 0 ? true : false)
      setIsBoss(selected.name === "boss" ? true : false);
      setValue('name', selected.name);
      setValue('label', selected.label);
      setValue('salary', selected.salary.toString());
      const data: listpermsEntry[] = await fetchNui("getPermsData", {
        jobName: selected.name,
      });
      setDataPerms(data || []);
    } else {
      setFirstIndex(false)
      setIsBoss(false);
      setDataPerms([]);
    }
  };

  const onSubmit: SubmitHandler<FormValue> = async (data) => {
    if (selectedGrade !== null) {
        switch(data.action){
          case 'create':
            await fetchNui("setgrade",{
              action : 'create',
              gradeName: data.name,
              gradeLabel: data.label,
              gradeSalary: data.salary
            })
            break;
          case 'update':
            await fetchNui("setgrade",{
              action : 'update',
              gradeSelect: grades[selectedGrade].grade,
              gradeName: data.name,
              gradeLabel: data.label,
              gradeSalary: data.salary
            })
            break;
          case 'delete':
            await fetchNui("setgrade",{
              action : 'delete',
              gradeSelect: grades[selectedGrade].grade,
            })
            break;
          default:
              console.log(`Action: ${data.action}, Index: ${selectedGrade}`)
              break;
        }
    }
  };

  const handleButtonPremClick = async (action:string) => {
    if (selectedPerm !== null && selectedGrade !== null) {
        switch(action){
            case 'on':
              await fetchNui("setPerms",{
                action : 'active',
                permissionSelect: dataPerms[selectedPerm].key,
                gradeSelect: grades[selectedGrade].grade
              })
              setSelectedGrade(null)
              break;
            case 'off':
                await fetchNui("setPerms",{
                  action : 'inactive',
                  permissionSelect: dataPerms[selectedPerm].key,
                  gradeSelect: grades[selectedGrade].grade
                })
                setSelectedGrade(null)
                break;
            default:
                console.log(`Action: ${action}, Index: ${selectedGrade}`)
                break;
        }
    }
  };

  const handlePermClick = (index: number) => {
    setSelectedPerm((lastIndex) => (lastIndex === index ? null : index));
  };

  useEffect(() => {
    async function fetchGrades() {
      const data: gradesEntry[] = await fetchNui("getAllGrades");
      setGrades(data || []);
    }
    fetchGrades();
  }, []);

  useNuiEvent('updateGrade',async () => {
    const data: gradesEntry[] = await fetchNui("getAllGrades");
    setGrades(data || []);
  })

  return (
    <div className="flex flex-col w-3/4">
      <h1 className="self-center text-2xl font-bold">Grade(s)</h1>
      <div className="flex flex-row gap-3 w-full h-full my-4 rounded-xl">
        <div className="flex flex-col w-1/2 h-full bg-clip-border rounded-xl bg-white shadow-md">
          <div className="bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-3">
            <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900">
              Grades
            </h6>
          </div>
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                  <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                    Id
                  </p>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                  <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                    Name
                  </p>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                  <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                    Nom affiché
                  </p>
                </th>
                <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                  <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                    Salaire
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {grades.map((entry, index) => (
                <tr
                  key={index}
                  onClick={() => handleGradeClick(index)}
                  className={selectedGrade === index ? "bg-gray-200" : ""}
                >
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600">
                      {entry.grade}
                    </p>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600">
                      {entry.name}
                    </p>
                  </td>
                  <td className="py-3 px-5 border-b border-blue-gray-50">
                    <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600">
                      {entry.label}
                    </p>
                  </td>
                  <td className="border-b border-blue-gray-50 py-3 px-6 text-left">
                    <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                      {entry.salary} $
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div
          className={`flex flex-col w-1/2 h-full gap-3 transition-opacity duration-500 ${
            selectedGrade !== null
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {userPermissions.includes('grade.Edit') && (
          <div className="rounded-xl h-1/2 bg-white h-full shadow-md">
            <div className="bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-3">
              <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900">
                Modification
              </h6>
            </div>
            <form onSubmit={rhfHandleSubmit(onSubmit)}>
              <div className="flex items-center flex-col gap-3 mb-4">
                  <div className={`flex flex-col ${isBoss ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
                    <label className="text-sm font-bold text-black-500">Nom</label>
                    <input type="text" {...register('name')} className="text-center shadow-sm rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></input>
                  </div>
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-black-500">Nom affiché</label>
                  <input type="text" {...register('label')} className="text-center shadow-sm rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></input>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-black-500">Salaire</label>
                  <input type="text" {...register('salary')} className="text-center shadow-sm rounded-md border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></input>
                </div>
              </div>
              <div className="flex gap-3 mx-2">
                <button className={`rounded-md w-1/2 h-1/2 bg-blue-500 text-white font-sans text-base font-semibold shadow-md transition-opacity duration-500 shadow-blue-500/20 ${isBoss || !userPermissions.includes('grade.Create') ? "opacity-0 pointer-events-none" : "opacity-100"} hover:shadow-lg hover:shadow-blue-500/40`} type="submit" value="create" {...register('action')} onClick={() => setValue('action', 'create')}>
                  Creer un grade
                </button>
                <button type="submit" value="update" {...register('action')} onClick={() => setValue('action', 'update')} className="rounded-md w-1/2 h-1/2 bg-green-500 text-white font-sans text-base font-semibold shadow-md shadow-green-500/20 hover:shadow-lg hover:shadow-green-500/40">
                  Mettre a jour
                </button>
                <button className={`rounded-md w-1/2 h-1/2 bg-red-500 text-white font-sans text-base font-semibold shadow-md transition-opacity duration-500 shadow-green-500/20 ${isBoss || firstIndex || !userPermissions.includes('grade.Delete') ? "opacity-0 pointer-events-none" : "opacity-100"} hover:shadow-lg hover:shadow-red-500/40`} type="submit" value="delete" {...register('action')} onClick={() => setValue('action', 'delete')}>
                  Supprimé
                </button>
              </div>
            </form>
          </div>
          )}
          {userPermissions.includes("grade.Perms") && (
            <div
              className={`rounded-xl bg-white h-1/2 shadow-md transition-opacity duration-500 ${
                isBoss ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <div className="bg-clip-border rounded-xl overflow-hidden bg-transparent text-gray-700 shadow-none m-0 flex items-center justify-between p-3">
                <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-blue-gray-900">
                  Permissions
                </h6>
              </div>
              <div className="max-h-48 overflow-y-auto">
                <table className="w-full table-auto h-3/4">
                  <thead>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Permission
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Information
                      </p>
                    </th>
                    <th className="border-b border-blue-gray-50 py-3 px-6 text-left">
                      <p className="block antialiased font-sans text-[11px] font-medium uppercase text-blue-gray-400">
                        Etat
                      </p>
                    </th>
                  </thead>
                  <tbody>
                    {dataPerms.map((entry, index) => (
                      <tr
                        key={index}
                        onClick={() => handlePermClick(index)}
                        className={selectedPerm === index ? "bg-gray-200" : ""}
                      >
                        <td className="border-b border-blue-gray-50 py-3 px-6 text-left">
                          <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600">
                            {entry.key}
                          </p>
                        </td>
                        <td className="border-b border-blue-gray-50 py-3 px-6 text-left">
                          <p className="block antialiased font-sans text-xs font-medium text-blue-gray-600">
                            {entry.label}
                          </p>
                        </td>
                        <td className="border-b border-blue-gray-50 py-3 px-6 text-left">
                          <p
                            className={`block antialiased font-sans text-xs font-medium text-blue-gray-600 ${
                              entry.state ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {entry.state ? "Actif" : "Inactif"}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div
                className={`flex gap-3 mx-2 justify-between shadow-md transition-opacity duration-500 ${
                  selectedPerm !== null
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <button onClick={() => handleButtonPremClick('on')} className="rounded-md w-1/2 h-1/2 bg-green-500 text-white font-sans text-base font-semibold shadow-md">
                  Actif
                </button>
                <button onClick={() => handleButtonPremClick('off')} className="rounded-md w-1/2 h-1/2 bg-red-500 text-white font-sans text-base font-semibold shadow-md">
                  Inactif
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default grades;
