function similarity(x,userdata){
    let myID = Cookies.get("id")
    if(typeof myID === 'undefined'){
        return 0
    }

    let y = userdata.find((e)=>{return e.userID == myID} )
    y = y["subjects"].map(function(e,i){
        return e.toString() + y["numbers"][i].toString()  
        })

    let score = 0
    let totalunits = 0
    let units = 0
    for(k=0;k<y.length;k++){
        // check if 1 unit
        if (y[k].includes("XT") || y[k] == "SOR" || y[k] == "ACCMAX"){
            units = 1
        }else{
            units = 2
        }
        
        if (x.includes(y[k]) ){
            score += units
        }
        totalunits += units

    }
    return score*100/totalunits
}

function displayID(userdata){
    let myID = Cookies.get("id")
    if(typeof myID === 'undefined'){
        return 0
    }
    let y = userdata.find((e)=>{return e.userID == myID} )
    $('#showlogin').text("Logged in as: " + y.name + " ("+y.userID+")")
    y = y["subjects"].map(function(e,i){
        return e.toString() + y["numbers"][i].toString()  
    })
}

function changeID(id){
    Cookies.set('id', id)
    window.location.href = "/db"
}

function adduser(t,userdata){
    let usertable = $('#table_id').DataTable();
    let rowdata = []
    
    rowdata.push(t["userID"])
    rowdata.push(t["name"])

    // adds all the subject codes and their numbers to one string on each line
    // eg    "ENG" + "1" -> "ENG1"
    // but for all of them
    let subject_totals = t["subjects"].map(function(e,i){
        return e.toString() + t["numbers"][i].toString()  
    })
    subject_totals.sort()
    rowdata = rowdata.concat(subject_totals)
    rowdata.push(similarity(subject_totals,userdata))
    usertable.row.add( rowdata ).draw( false );
}

$(document).ready( async function () {
    var userdata = await $.getJSON('/api');
    console.log(userdata)
    let myID = Cookies.get("id")


    let usertable = $('#table_id').DataTable();
    if(typeof myID !== 'undefined'){
        let t = userdata.find((e)=>{return e.userID == myID})
        adduser(t,userdata)
    }
    $("userrow").addClass( 'highlight' );
    for(i=0;i<userdata.length;i++){
        let t = userdata[i]
        if (typeof myID !== 'undefined' && userdata[i].userID == myID){
            continue
        }
        adduser(t,userdata)
    }
    displayID(userdata)
    
    $('#table_id tbody')
        .on( 'click', 'td', function () {
            var rowIdx = usertable.cell(this).index().row;
            changeID(usertable.row(rowIdx).data()[0])
        } );
    


} );
