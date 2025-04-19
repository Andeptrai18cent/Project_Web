const collection = document.getElementsByTagName("dt");
const link = "/html/service_info.html"
for (dt of collection){
    inner_text = dt.innerHTML;
    dt.innerHTML = "<a href=" + link + ">" + inner_text + "</a>";
}