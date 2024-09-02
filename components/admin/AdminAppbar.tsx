"use client"
import { signOut } from "next-auth/react"
import { Button } from "../ui/button"

export const AdminAppbar = () => {
    return <>
        <div className="bg-slate-300 h-full w-full px-10 text-black">
            <div className="flex justify-between items-center h-full w-full px-4">
                <div className="cursor-pointer">
                    logo
                </div>
                <div className="flex justify-between">
                    <Button variant={"default"} onClick={() => signOut()}>
                        Signout
                    </Button>
                </div>
            </div>
        </div>
    </>
}