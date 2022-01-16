function similarity(x,userdata){
    var myID = Cookies.get("id")
    if(typeof myID === 'undefined'){
        return 0
    }

    let y = userdata.find((e)=>{return e.userID == myID} )
    y = y["subjects"].map(function(e,i){
        return e.toString() + y["numbers"][i].toString()  
        })

    var score = 0
    var totalunits = 0
    var units = 0
    for(k=0;k<x.length;k++){
        // check if 1 unit
        if (x[k].includes("XT") || x[k] == "SOR"){
            units = 1
        }else{
            units = 2
        }
        
        if (x[k] == y[k] ){
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
  var userdata = await $.getJSON('/api');
  console.log(userdata)



  var usertable = $('#table_id').DataTable();
  for(i=0;i<userdata.length;i++){
    let t = userdata[i] 
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
    rowdata.push(similarity(subject_totals,userdata))
    usertable.row.add( rowdata ).draw( false );
  }




} );
