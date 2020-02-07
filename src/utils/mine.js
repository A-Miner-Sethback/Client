const hash = require('hash.js')
const utf8 = require('utf8')

export const mineFunc = async (last_proof, difficulty) =>
{
    let proof = Math.random()
    while(!validProof(last_proof, proof, difficulty))
    {
        console.log('proof val', proof)
        proof += 1
    }
    return proof
}

function validProof(last_proof, proof, difficulty)
{
    let guess = utf8.encode(`${last_proof}${proof}`)
    let guessHash = hash.sha256(guess).digest('hex')
    for(let i=0; i<difficulty; i++)
    {
        if(guessHash[i] !== 0) return false
    }
    return true
}