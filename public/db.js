function similarity(x){
    if(typeof myID === 'undefined'){
        return 0
    }
    var y = data[myID]["subjects"].map(function(e,i){
        return e.toString() + data[myID]["numbers"][i].toString()  
        })
    var score = 0
    var totalunits = 0
    var units = 0
    for(i=0;i<x.length;i++){
        // check if 1 unit
        if (x[i].includes("XT") || x[i] == "SOR"){
            units = 1
        }else{
            units = 2
        }
        
        if (x[i] == y[i] ){
            score += units
        }
        totalunits += units

    }
    return score*100/totalunits
}

function changeID(id){
    Cookies.set('id', id)
    window.location.href = "/db"
}


$(document).ready( async function () {
  var data = await $.getJSON('/api');
  console.log(data)



  var usertable = $('#table_id').DataTable();
  for(i=0;i<data.length;i++){
    let t = data[i] 
    let rowdata = []
    rowdata.push(t["userID"])
    rowdata.push(t["name"])

    // adds all the subject codes and their numbers to one string on each line
    // eg    "ENG" + "1" -> "ENG1"
    // but for all of them
    let subject_totals = t["subjects"].map(function(e,i){
        return e.toString() + t["numbers"][i].toString()  
    })

    rowdata = rowdata.concat(subject_totals)
    rowdata.push(similarity(subject_totals))
    usertable.row.add( rowdata ).draw( false );
  }




} );
