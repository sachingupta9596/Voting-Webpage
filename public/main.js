const form = document.getElementById("vote-form");

form.addEventListener("submit", (e) => {
  const choice = document.querySelector("input[name=os]:checked");
  const name = choice.value;
  const data = { os: name };

  fetch("http://localhost:3000/poll", {
    method: "POST",
    body: JSON.stringify(data),
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  })
    .then((res) => res.json())
    .then((json) => console.log(json))
    .catch((err) => console.log(err));
  e.preventDefault();
});

fetch("http://localhost:3000/poll")
  .then((res) => res.json())
  .then((data) => {
    const votes = data.votes;
    const totalVotes = votes.length;

    console.log(totalVotes);
    // count vote point
    const voteCounts = votes.reduce(
      (acc, vote) => (
        (acc[vote.os] = (acc[vote.os] || 0) + parseInt(vote.points)), acc
      ),
      {}
    );

    let dataPoints = [
      { label: "Windows", y: voteCounts.Windows },
      { label: "Macos", y: voteCounts.Macos },
      { label: "Linux", y: voteCounts.Linux },
      { label: "Others", y: voteCounts.Others },
    ];

    const chartContainer = document.querySelector("#chartContainer");

    if (chartContainer) {
      var chart = new CanvasJS.Chart("chartContainer", {
        theme: "light1", // "light2", "dark1", "dark2"
        animationEnabled: true, // change to true
        title: {
          text: `Total Votes ${totalVotes}`,
        },
        data: [
          {
            // Change type to "bar", "area", "spline", "pie",etc.
            type: "column",
            dataPoints: dataPoints,
          },
        ],
      });
      chart.render();

      Pusher.logToConsole = true;

      var pusher = new Pusher("69b17460791d8d78e553", {
        cluster: "ap2",
        encrypted: true,
      });

      var channel = pusher.subscribe("os-poll");

      channel.bind("os-vote", function (data) {
        dataPoints = dataPoints.map(function (x) {
          if (x.label == data.os) {
            x.y += data.points;
            return x;
          } else {
            return x;
          }
        });
        chart.render();
      });
    }
  });
