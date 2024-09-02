"use client"

export const BranchCard = ({ name, code }: {
    name: string, code: string,
}) => {
    return <>
        <a href="" className="block max-w-sm p-5 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700">
            <h3 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">{ name }</h3>
            <p className="font-normal text-gray-700 dark:text-gray-400">{ code }</p>
        </a>
    </>
}
