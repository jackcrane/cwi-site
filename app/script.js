let engine = {
  consts:{
    maxrank:25
  },
  ftcstats:{
    getName:async (e) => {
      let headers = new Headers(); headers.append("Accept", "application/json");
      let formdata = new FormData(); formdata.append("teamnum", e);
      let requestOptions = {
        method: 'POST',
        headers: headers,
        body: formdata,
        redirect: 'follow'
      };

      let response = await fetch("https://dynamic.jackcrane.rocks/api/ftcstats/fetch.php", requestOptions)
      let r_json = await response.json();
      if(r_json.data[0]?.teamname!=undefined) {
        return [r_json.data[0]?.teamname,r_json.data[0]?.location];
      } else {
        return undefined
      }
    },
    getRank:async (numstate) => {
      let best = "Qualified";
      let rank = -1;

      let num = numstate[0];
      let state = numstate[1];

      let headers = new Headers(); headers.append("Accept", "application/json");
      let formdata = new FormData(); formdata.append("location", state);
      let requestOptions = {
        method: 'POST',
        headers: headers,
        body: formdata,
        redirect: 'follow'
      };

      let response = await fetch("https://dynamic.jackcrane.rocks/api/ftcstats/fetch.php", requestOptions)
      let r_json = await response.json();

      for(e of Object.keys(r_json.data)) {
        if(parseInt(r_json.data[e]?.teamnum) == num) {
          if(e < engine.consts.maxrank) {
            rank = e;
            break;
          } else {
            best = "Waitlisted";
          }
        }
      }

      return {
        status:best,
        rank:rank
      }

      // if(r_json.data[0]?.teamname!=undefined) {
      //   return [r_json.data[0]?.teamname,r_json.data[0]?.location];
      // } else {
      //   return undefined
      // }
    }
  },
  ops:{
    hash:function(e) {
      document.getElementById("section-" + e.target.location.hash.split("#")[1]).scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
      document.querySelectorAll("section").forEach(e=>e.classList.remove('focus'))
      document.getElementById("section-" + e.target.location.hash.split("#")[1]).classList.add('focus')
    }
  }
}

document.querySelector("input[name='teamnum']").addEventListener('keyup',e=>{
  if(e.target.value != "" && !isNaN(e.target.value)) {
    engine.ftcstats.getName(parseInt(e.target.value)).then(c=>{
      if(c!=undefined) {
        engine.ftcstats.getRank([parseInt(e.target.value),c[1]]).then(b=>{
          document.querySelector('div.details').innerHTML = "";
          let name = document.createElement("p");
          name.innerHTML = `Team name: ${c[0]}`;
          let location = document.createElement("p");
          location.innerHTML = `Region: ${c[1]}`;
          let status = document.createElement("strong");
          status.innerHTML = `Status: ${b.status}`;
          document.querySelector('div.details').appendChild(name);
          document.querySelector('div.details').appendChild(location);
          document.querySelector('div.details').appendChild(status);
          document.querySelector('input[name="teamsub"]').disabled = false;
        })
      } else {
        let p = document.createElement("p");
        p.innerText = "Enter your team number above to get details";
        document.querySelector('div.details').innerHTML = "";
        document.querySelector('div.details').appendChild(p);
        document.querySelector('input[name="teamsub"]').disabled = true;
      }
    })
  } else {
    let p = document.createElement("p");
    p.innerText = "Enter your team number above to get details";
    document.querySelector('div.details').innerHTML = "";
    document.querySelector('div.details').appendChild(p);
    document.querySelector('input[name="teamsub"]').disabled = true;
  }
})

window.addEventListener('hashchange',engine.ops.hash)
window.addEventListener('load',engine.ops.hash)
