
let rectWidth = 0;
let nBins = 20;
let mapper;


let margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = d3.select("#graph_data")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom+100)
    .attr("transform","translate(200,0)")
    .append("g")
    .attr("transform",
          "translate("+margin.left+"," + margin.top + ")");
   
    
    let tooltip = d3.select("#graph_data")
                    .append("div")
                    .attr("class","tooltip")
                    .style("background-color", "black")
                    .style("color", "white")
                    .style("border-radius", "5px")
                    .style("padding", "10px");

     
   let calledFunction = 0; 

   function maping(){

   	   switch(calledFunction){
 
           case 1:
               plot_weight();
               break;
           case 2:
               plot_wage();
               break;
           case 3:
               plot_value();
               break;
           case 4:
               plot_age();
               break;
           case 5:
               plot_clause();
               break;
           case 6:
               plot_rating();
               break;
           case 7:
               plot_potential();
               break;
           case 8:
               plot_skill();
               break;
           case 9:
               plot_reputation();
               break;
           case 10:
               plot_stamina();
               break;
           case 11:
               plot_reflexes();
               break;
           case 12:
               plot_height();
               break;        
           default :
              break;    


          }
   }
   d3.select("#nBin").on("input", function() {
 	    nBins = this.value;
      maping();
   });

  function getTooltipData(d){

       if(Array.isArray(d)){
            
            return "Range: "+ d.x0+ " - " + d.x1+"<br>"+"Players :" +d.length;

       }else{

          return d + "<br>" +"Players: "+ mapper[d];
       }

  }
   
   let showTooltip = function(d){

    rectWidth = this.width.animVal.value;
    d3.select(this)
        .transition()
        .duration(100)
        .attr("width",rectWidth*1.02)
        .style('fill', '#ff0000');

    tooltip.transition().duration(100)
                .style("opacity", 1);
    tooltip.html(getTooltipData(d))
             .style("left", (d3.event.pageX+20) + "px")
             .style("top", (d3.event.pageY) + "px");


 }   

 let moveTooltip = function(d){

 
    d3.select(this)
        .transition()
        .duration(100)
        .attr("width",rectWidth*1.02)
        .style('fill', '#ff0000');
    
        tooltip.style("left", (d3.event.pageX+20) + "px")
             .style("top", (d3.event.pageY) + "px");


 }
 let hideTooltip = function(){
  
    d3.select(this)
        .transition()
        .duration(100)
        .attr("width",rectWidth)
        .style('fill', 'rgb(0,123,255)');
                 tooltip.transition()
                 .duration(100)
                 .style("opacity", 0);

 }

 function findMin(num1, num2){

       if(num1 > num2){

          return num2;
       }

       return num1;
 }
function remover(){
  
    svg.selectAll("*").remove();
}

function count(arr) {
  return arr.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {})
}

function createXScaleNum(data){

      let x = d3.scaleLinear()
                .domain([0,d3.max(data,function(d){return +d}
                  ) + 10  ])
                .range([0,width]);
      return x;          
}

function createYScaleNum(data){

    let y = d3.scaleLinear()
              .domain([0,d3.max(data,function(d){return d.length})])
              .range([height,0]);

     return y;         
}

function appendXNumScale(xScale,label){

     svg.append("g").attr("transform", "translate(0,"+ height+")")
                        .call(d3.axisBottom(xScale));
     svg.append("text").attr("transform", "translate("+ (width/2)+","+ (height+40)+")")
                        .text(label);               

}

function appendYNumScale(yScale,label){

        svg.append("g").call(d3.axisLeft(yScale));
        svg.append("text").attr("transform", "translate("+-28+","+height/2+")rotate(-90)")
                          .text(label);

}

function createHistogram(xScale, data){

     let hist  = d3.histogram()
              .domain(xScale.domain())
              .thresholds(xScale.ticks(nBins));

    let bins = hist(data);

       return bins;
}

function appendHistogram(xScale, yScale, bins){
 
  

  svg.selectAll("rect")
           .data(bins)
           .enter()
             .append("rect")
             .attr("x", 1)
             .attr("transform", function(d) { return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")"; })
             .attr("width", function(d) { return xScale(d.x1) - xScale(d.x0)  ; })
             .attr("height", function(d) { return height - yScale(d.length); })
             .style("fill", "rgb(0,123,255)")
             .on("mouseover", showTooltip)
             .on("mousemove", moveTooltip)
             .on("mouseleave", hideTooltip);
 

}


function createXScale(data){

      let x = d3.scaleBand()
                .domain(data)
                .range([0,width]);
      return x;

}

function appendXScale(xScale, label,numbers){

   
   svg.append("g").attr("transform", "translate(0,"+ height+")")
                  .call(d3.axisBottom(xScale).tickValues(xScale.domain().filter(function(d,i){ if(i!=0)return !(i%numbers)})))
                  .selectAll("text")
       
   
   svg.append("text").attr("transform", "translate("+ (width/2)+","+ (height+40)+")")
                        .text(label);  

}

function createYScale(data){

      let y = d3.scaleLinear()
                .domain([0,d3.max(data,function(d){return +d})])
                .range([height,0]);
      return y;

}

function appendYScale(yScale, label){

     svg.append("g").call(d3.axisLeft(yScale));
     svg.append("text").attr("transform", "translate("+-28+","+height/2+")rotate(-90)")
                          .text(label);

    }


function appendBarChart(xScale, yScale, data){

         
         let barWidth = parseInt(findMin(width/parseFloat(data.length) - 2.0, 30)); 
         if(barWidth < 5){
           barWidth = 4;
         }
         svg.selectAll("rect")
           .data(data)
           .enter()
             .append("rect")
             .attr("x", function(d){return xScale(d)+1.2;})
             .attr("y",function(d){return yScale(mapper[d]);})
             .attr("width", function(d) { return  barWidth; })
             .attr("height", function(d) { return height - yScale(mapper[d]); })
             .style("fill", "rgb(0,123,255)")  
             .on("mouseover", showTooltip)
             .on("mousemove", moveTooltip)
             .on("mouseleave", hideTooltip);


}


let plot_weight = function(){
    
   remover();
   calledFunction = 1;
   d3.csv("csv/football.csv", function(data){

         weight = data.map(function(d){return parseFloat(d.Weight.replace("lbs",""))});
         xScale = createXScaleNum(weight);
         appendXNumScale(xScale,"weight(lbs)")
         bins = createHistogram(xScale,weight);
         yScale = createYScaleNum(bins);
         appendYNumScale(yScale,"players");
         appendHistogram(xScale,yScale,bins);
         
   });


}



function plot_wage(){

    remover();
    calledFunction = 2;
    d3.csv("csv/football.csv", function(data){
         wage = data.map(
          function(d){
            divide = 1;
                if(d.Wage.includes("K")){
                  divide = 1000;
                }
            return parseFloat(d.Wage.replace("K","").replace("M","").replace(/\u20ac/g,"")/parseFloat(divide));


          });
         xScale = createXScaleNum(wage);
         appendXNumScale(xScale,"euro(in Millions)")
         bins = createHistogram(xScale,wage);
         yScale = createYScaleNum(bins);
         appendYNumScale(yScale,"players");
         appendHistogram(xScale,yScale,bins);
         
   });


}

function plot_value(){


    remover();
    calledFunction = 3;
    d3.csv("csv/football.csv", function(data){
         pval = data.map(
          function(d){
            divide = 1;
                if(d.Value.includes("K")){
                  divide = 1000;
                }
            return parseFloat(d.Value.replace("M","").replace("K","").replace(/\u20ac/g,"")/parseFloat(divide));
          });
         xScale = createXScaleNum(pval);
         appendXNumScale(xScale,"euro(in millon)")
         bins = createHistogram(xScale,pval);
         yScale = createYScaleNum(bins);
         appendYNumScale(yScale,"players");
         appendHistogram(xScale,yScale,bins);
         
   });



}

function plot_age(){


    remover();
    calledFunction = 4;
    d3.csv("csv/football.csv", function(data){
         age = data.map(function(d){return parseInt(d.Age)});
         xScale = createXScaleNum(age);
         appendXNumScale(xScale,"age")
         bins = createHistogram(xScale,age);
         yScale = createYScaleNum(bins);
         appendYNumScale(yScale,"players");
         appendHistogram(xScale,yScale,bins);
         
   });



}

function plot_clause(){


   remover();
    calledFunction = 5;
    d3.csv("csv/football.csv", function(data){
         pval = data.map(
              function(d){
                divide = 1;
                if(d.Clause_money.includes("K")){
                  divide = 1000;
                }
                return parseFloat(d.Clause_money.replace("M","").replace("K","").replace(/\u20ac/g,"")/parseFloat(divide));

            });
         xScale = createXScaleNum(pval);
         appendXNumScale(xScale,"euro(in millions)");
         bins = createHistogram(xScale,pval);
         yScale = createYScaleNum(bins);
         appendYNumScale(yScale,"players");
         appendHistogram(xScale,yScale,bins);
         
   });
  


}

function plot_nation(){

     remover();
     calledFunction = 0;
     d3.csv("csv/football.csv", function(data){
         nation = data.map(function(d){return (d.Nationality)});
         mapper = count(nation);
         rNations = Object.keys(mapper);
         rFreq = Object.values(mapper);
         xScale = createXScale(rNations);
         appendXScale(xScale, "countries",10);     
         yScale = createYScale(rFreq);
         appendYScale(yScale, "players")
         appendBarChart(xScale, yScale, rNations);       
 
        });
}

function plot_rating(){

    remover();
    calledFunction = 6;
    d3.csv("csv/football.csv", function(data){
         rating= data.map(function(d){return parseFloat(d.Rating)});
         xScale = createXScaleNum(rating);
         appendXNumScale(xScale,"rating")
         bins = createHistogram(xScale,rating);
         yScale = createYScaleNum(bins);
         appendYNumScale(yScale,"players");
         appendHistogram(xScale,yScale,bins);
         
   });

}

function plot_potential(){

 
    remover();
    calledFunction = 7;
    d3.csv("csv/football.csv", function(data){
         potential= data.map(function(d){return parseFloat(d.Potential)});
         xScale = createXScaleNum(potential);
         appendXNumScale(xScale,"potential")
         bins = createHistogram(xScale,potential);
         yScale = createYScaleNum(bins);
         appendYNumScale(yScale,"players");
         appendHistogram(xScale,yScale,bins);
         
   });
   


}

function plot_skill(){

    remover();
    calledFunction = 8;
    d3.csv("csv/football.csv", function(data){
         skill= data.map(function(d){return parseFloat(d.Skill_rating)});
         xScale = createXScaleNum(skill);
         appendXNumScale(xScale,"skill")
         bins = createHistogram(xScale,skill);
         yScale = createYScaleNum(bins);
         appendYNumScale(yScale,"players");
         appendHistogram(xScale,yScale,bins);
         
   });


}

function plot_reputation(){

   remover();
    calledFunction = 9;
    d3.csv("csv/football.csv", function(data){
         rep= data.map(function(d){return parseFloat(d.Reputation)});
         xScale = createXScaleNum(rep);
         appendXNumScale(xScale,"reputation")
         bins = createHistogram(xScale,rep);
         yScale = createYScaleNum(bins);
         appendYNumScale(yScale,"players");
         appendHistogram(xScale,yScale,bins);
         
   });
}

function plot_stamina(){

    remover();
    calledFunction = 10;
    d3.csv("csv/football.csv", function(data){
         stamina= data.map(function(d){return parseFloat(d.Stamina)});
         xScale = createXScaleNum(stamina);
         appendXNumScale(xScale,"stamina");
         bins = createHistogram(xScale,stamina);
         yScale = createYScaleNum(bins);
         appendYNumScale(yScale,"players");
         appendHistogram(xScale,yScale,bins);
         
   });
  
}

function plot_reflexes(){

    remover();
    calledFunction = 11;
    d3.csv("csv/football.csv", function(data){
         reflex= data.map(function(d){return parseFloat(d.Reflexes)});
         xScale = createXScaleNum(reflex);
         appendXNumScale(xScale,"reflexes")
         bins = createHistogram(xScale,reflex);
         yScale = createYScaleNum(bins);
         appendYNumScale(yScale,"players");
         appendHistogram(xScale,yScale,bins);
         
   });
   

}

function plot_height(){

   
    remover();
    calledFunction = 12;
    d3.csv("csv/football.csv", function(data){
         hei = data.map(function(d){return parseFloat(d.Height.split('\'')[0]*12) + parseFloat(d.Height.split('\'')[1])});
         console.log(hei);
         xScale = createXScaleNum(hei);
         appendXNumScale(xScale,"height(in inches)")
         bins = createHistogram(xScale,hei);
         yScale = createYScaleNum(bins);
         appendYNumScale(yScale,"players");
         appendHistogram(xScale,yScale,bins);
         
   });

}

function plot_foot(){

     remover();
     calledFunction = 0;
     d3.csv("csv/football.csv", function(data){
         foot = data.map(function(d){return (d.Foot)});
         mapper = count(foot);
         console.log(mapper.length);
         rFoot = Object.keys(mapper);
         rFreq = Object.values(mapper);
         xScale = createXScale(rFoot);
         appendXScale(xScale, "Foot",5);     
         yScale = createYScale(rFreq);
         appendYScale(yScale, "players")
         appendBarChart(xScale, yScale, rFoot);       
 
        });


}


function plot_club(){

     remover();
     calledFunction = 0;
     d3.csv("csv/football.csv", function(data){
         club = data.map(function(d){return (d.Club)});
         mapper = count(club);
         rClub = Object.keys(mapper);
         rFreq = Object.values(mapper);
         xScale = createXScale(rClub);
         appendXScale(xScale, "Club",30);     
         yScale = createYScale(rFreq);
         appendYScale(yScale, "players")
         appendBarChart(xScale, yScale, rClub);       
 
        });


}

d3.select("#page-content-wrapper").on("mousedown", function() {
    
    let div = d3.select(this)
        .classed("active", true);

    let xPos = d3.mouse(div.node())[0];


      let win = d3.select(window)
      .on("mousemove", mousemove)
      .on("mouseup", function(){
        div.classed("active", false);
          win.on("mousemove", null).on("mouseup", null);
      });

      function mousemove() {
        elem  = document.getElementById("nBin");
        if(d3.mouse(div.node())[0] + 20 < xPos){
            
            if(elem.value > 1 && elem.value <100){
            elem.value = elem.value - 1;
            elem.dispatchEvent(new Event("input"));
          }else{

              elem.value = 1;
          }

          xPos = d3.mouse(div.node())[0];
        }
        else if(d3.mouse(div.node())[0] - 20 > xPos ){
         
            elem.value = parseInt(elem.value) + 1;
            if(elem.value >= 96)
              elem.value = 96;
            elem.dispatchEvent(new Event("input"));
            xPos = d3.mouse(div.node())[0];
        }
    }

  }); 