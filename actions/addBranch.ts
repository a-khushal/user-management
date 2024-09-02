import db from '../db/index'

export async function addBranch({name, code}: {
    name: string,
    code: string
}) {
    try {
        const branch = await db.branch.create({
            data: {
                name: name,
                code: code,
            }
        })

        return {
            message: 'new branch created',
        }
    } catch(e) {
        console.log(e);
        return {
            error: "error while creating new branch"
        }
    }
}