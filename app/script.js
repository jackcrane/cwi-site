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
      document.getElementById("section-" + e.target.location.hash.split("#")[1])?.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
      document.querySelectorAll("section").forEach(e=>e.classList.remove('focus'))
      document.getElementById("section-" + e.target.location.hash.split("#")[1])?.classList.add('focus')
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
document.querySelectorAll("section").forEach(e=>{
  e.addEventListener('mouseover',o=>{if(o.target.localName == "section") document.location.hash = o.target.id.split("-")[1]})
})

document.querySelector("#section-signup").querySelector("input[type='email']").addEventListener('keyup',e=>{
  if(e.target.parentNode.parentNode.querySelector("input[type='password']").value != "" && e.target.value != "") {
    e.target.parentNode.parentNode.querySelector("input[type='submit']").disabled = false;
  } else {
    e.target.parentNode.parentNode.querySelector("input[type='submit']").disabled = true;
  }
})

document.querySelector("#section-signup").querySelector("input[type='password']").addEventListener('keyup',e=>{
  if(e.target.parentNode.parentNode.querySelector("input[type='email']").value != "" && e.target.value != "") {
    e.target.parentNode.parentNode.querySelector("input[type='submit']").disabled = false;
  } else {
    e.target.parentNode.parentNode.querySelector("input[type='submit']").disabled = true;
  }
})

let e_to_delete = "";
document.querySelector("#section-accounts").querySelector("input[type='submit']").addEventListener('click',e=>{
  let parent = e.target.parentNode;
  let name = parent.querySelector("input[type='text']").value || "Not supplied";
  let email = parent.querySelector("input[type='email']").value || "Not supplied";
  let rank = "";
  for(radio of Array.from(parent.querySelectorAll("input[type='radio']"))) {
    if(radio.checked) {
      rank = radio.value;
      break;
    };
  }
  parent.querySelector("input[type='text']").value = "";
  parent.querySelector("input[type='email']").value = "";
  let r = document.createElement("div");
  r.classList.add("result");
  let t = document.createElement("span");
  t.classList.add("pill");
  t.classList.add(rank);
  t.innerText = rank;
  r.appendChild(t);
  let p = document.createElement("span");
  p.innerText = `${name} | ${email}`;
  r.appendChild(p);
  let ed = document.createElement("b");
  ed.innerHTML = "✏️";
  ed.title = "Edit this entry";
  ed.addEventListener("click",o=>{
    let rank = o.target.parentNode.children[0].classList[1];
    let name = o.target.parentNode.children[1].innerText.split(" | ")[0];
    let email = o.target.parentNode.children[1].innerText.split(" | ")[1];
    let fs = o.target.parentNode.parentNode.parentNode.querySelector("fieldset");
    fs.querySelector("input[type='text']").value = name;
    fs.querySelector("input[type='email']").value = email;
    fs.querySelector(`input[type='radio'][value='${rank}']`).checked = true;
    o.target.parentNode.remove();
  })
  let del = document.createElement("b");
  del.innerHTML = "❌";
  del.title = "Delete this entry";
  del.addEventListener("click",o=>{
    o.target.parentNode.remove();
  })
  r.appendChild(del)
  r.appendChild(ed)
  parent.parentNode.querySelector("fieldset.outputs").appendChild(r);
})
