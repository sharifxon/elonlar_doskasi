const filtering = (category, from, to, region) => {
    let filtering
    if(category && from && to && region){
        filtering = {
            category,
            amount: {$gte: from , $lte: to},
            region

        }
    }
    if(category && !from && !to && !region){
        filtering = {
            category,
        }
    }
    if(category && from && !to && !region){
        filtering = {
            category,
            amount: {$gte: from},

        }
    }
    if(category && !from && to && !region){
        filtering = {
            category,
            amount: {$lte: to}
}
    }
    if(category && !from && !to && region){
        filtering = {
            category,
            region

        }
    }
    if(!category && from && to && !region){
        filtering = {
            amount: {$gte: from , $lte: to},
        }
    }
    if(!category && from && !to && region){
        filtering = {
            amount: {$gte: from},
            region

        }
    }
    if(!category && !from && to && region){
        filtering = {
            amount: {$lte: to},
            region
        }
    }
    if(!category && from && to && region){
        filtering = {
            amount: {$gte: from , $lte: to},
            region

        }
    }
    if(category && !from && to && region){
        filtering = {
            category,
            amount: {$lte: to},
            region

        }
    }
    if(category && from && !to && region){
        filtering = {
            category,
            amount: {$gte: from},
            region
        }
    }
    if(category && from && to && !region){
        filtering = {
            category,
            amount: {$gte: from , $lte: to},

        }
    }
    if(!category && from && !to && !region){
        filtering = {
            amount: {$gte: from},

        }
    }
    if(!category && !from && to && !region){
        filtering = {
            amount: {$lte: to},

        }
    }
    if(!category && !from && !to && region){
        filtering = {
            region

        }
    }
    if(!category && !from && !to && !region){
        filtering = {}

    }

return filtering
    
    
}

module.exports = filtering