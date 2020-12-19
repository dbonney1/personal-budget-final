import React, { useState, useEffect } from "react";
import axios from "axios";
import { SketchPicker } from "react-color";
import { Pie, Line, Bar } from "react-chartjs-2";

import Button from "../../UI/Button/Button";
import Input from "../../UI/Input/Input";
import Form from "../../utils/Form/Form";
import MonthSelector from "../../UI/MonthSelector/MonthSelector";
import classes from "./Dashboard.module.css";
import Hero from "../../components/Hero/Hero";
import NavItems from "../../components/Nav/NavItems/NavItems";
const Dashboard = () => {
  const [budgets, setBudgets] = useState([]);
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [tags, setTags] = useState("");
  const [dataColor, setDataColor] = useState("#fff");
  const [month, setMonth] = useState("January");
  const [monthViewing, setMonthViewing] = useState("January");
  const [actualSpent, setActualSpent] = useState([]);
  const [charts, setCharts] = useState([]);
  const [chartBudgets, setChartBudgets] = useState([]);
  const [line, setLine] = useState([]);
  const [bar, setBar] = useState([]);
  const [barQuery, setBarQuery] = useState("");
  const [show, setShow] = useState({
    pie: false,
    line: false,
    bar: false,
  });

  // load in budgets from database after initial render
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    const token = localStorage.getItem("jwt");
    axios
      .get(`/api/budget/${userEmail}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
      .then((res) => {
        console.log(res);
        setBudgets(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const getBudget = () => {
    // use budget endpoint to retrieve data
    const userEmail = localStorage.getItem("userEmail");
    const token = localStorage.getItem("jwt");
    axios
      .get(`/api/budget/${userEmail}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      })
      .then((res) => {
        console.log(res);
        const newBudgets = res.data;
        setBudgets(newBudgets);
      })
      .then(() => {
        buildCharts();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // used for submitting a new budget
  const submitHandler = (event) => {
    event.preventDefault();
    const userEmail = localStorage.getItem("userEmail");
    const token = localStorage.getItem("jwt");

    // if an invalid request made, return
    if (
      title.length === 0 ||
      budget.length === 0 ||
      tags.length === 0
    )
      return;

    const budgetData = {
      title: title,
      budget: budget,
      tags: tags,
      user_FK: userEmail,
      dataColor: dataColor,
      month: month,
    };

    // headers to send in request
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    axios
      .post("/api/budget", budgetData, {
        headers: headers,
      })
      .then((res) => {
        console.log(res.data);
        console.log("Inserted one budget");

        // if successful, modify budgets to include new data and rebuild charts
        const newBudgets = Array.from(budgets.slice());
        newBudgets.push(budgetData);

        setBudgets([...newBudgets]);
      })
      .then(() => {
        buildCharts();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // used to submit actual item expenses
  const submitActualExpenses = (event, amountSpent) => {
    event.preventDefault();
    const token = localStorage.getItem("jwt");

    console.log("submitting actual expenses");
    amountSpent.forEach((spent) => {
      const budgetData = {
        actualSpent: spent.amount,
      };

      // headers to send in request
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      axios
        .put(`/api/budget/${spent.id}`, budgetData, {
          headers: headers,
        })
        .then((res) => {
          // if successful inform user
          console.log(res.data);
          console.log(`Updated budget with id ${spent.id}`);
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  // handler for changing actual expense values
  const handleActualSpent = (id, amount, actualSpentVals) => {
    const newActualSpent = Array.from(actualSpentVals.slice());
    // find the item's index in newActualSpent and change its amount
    const changedIndex = newActualSpent.findIndex((spent) => spent.id === id);
    newActualSpent[changedIndex].amount = amount;
    console.log(amount);
    // set actualSpent to newActualSpent
    setActualSpent(newActualSpent);
  };

  // used for determining total expected budget for each month
  const determineExpectedMonthlyBudgets = () => {
    // months to be considered
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let userBudgets = [];
    let userBudgetsByMonth = [];

    // cycle through each month, comparing to each budget and finding matching sets
    for (let month of months) {
      userBudgets = Array.from(budgets.slice());
      userBudgets = userBudgets.filter((budget) => {
        return budget.month === month;
      });
      // if no matches found, simply push a budget of 0 to the userBudgets array and skip to next cycle
      if (!userBudgets.length) {
        userBudgetsByMonth.push(0);
        continue;
      }

      // add all the budgets associated with each month together and push the monthly budget total to the thisMonthsExpectedBudget array
      let thisMonthsExpectedBudget = userBudgets
        .map((budget) => budget.budget)
        .reduce((accumulator, currentValue) => accumulator + currentValue);
      userBudgetsByMonth.push(thisMonthsExpectedBudget);
    }
    return userBudgetsByMonth;
  };

  // used for determining total expenses each month
  const determineActualMonthlyBudgets = () => {
    // months to be considered
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let userBudgets = [];
    let userBudgetsByMonth = [];

    // cycle through each month and create matching sets
    for (let month of months) {
      userBudgets = Array.from(budgets.slice());
      userBudgets = userBudgets.filter((budget) => {
        return budget.month === month;
      });
      // if no matches, simply push amount of 0 to array and skip to next iteration
      if (!userBudgets.length) {
        userBudgetsByMonth.push(0);
        continue;
      }
      // add up all budget amts of a given month together and push to array
      let thisMonthsActualBudget = userBudgets
        .map((budget) => budget.actualSpent)
        .reduce((accumulator, currentValue) => accumulator + currentValue);
      userBudgetsByMonth.push(thisMonthsActualBudget);
    }
    return userBudgetsByMonth;
  };

  // used to determine total expected budget per year for an item
  const determineExpectedSpentPerYear = (item) => {
    let userBudgets = [];
    let expectedAmountSpent = 0;

    // filter budgets to include only entries containing a given item
    userBudgets = Array.from(budgets.slice());
    userBudgets = userBudgets.filter((budget) => {
      return budget.title === item;
    });

    // if no matches, return 0 as amount
    if (!userBudgets.length) {
      return 0;
    }

    // if matches found, add up each corresponding budget amt and return the total
    expectedAmountSpent = userBudgets
      .map((budget) => budget.budget)
      .reduce((accumulator, currentValue) => accumulator + currentValue);

    return expectedAmountSpent;
  };

  // used to determine total actual amt spent per year for an item
  const determineActualSpentPerYear = (item) => {
    let userBudgets = [];
    let actualAmountSpent = 0;

    // filter budgets to include only entries containing a given item
    userBudgets = Array.from(budgets.slice());
    userBudgets = userBudgets.filter((budget) => {
      return budget.title === item;
    });

    // if no matches, return 0 as amount
    if (!userBudgets.length) {
      return 0;
    }

    // if matches found, add up each corresponding amount spent and return the total
    actualAmountSpent = userBudgets
      .map((budget) => budget.actualSpent)
      .reduce((accumulator, currentValue) => accumulator + currentValue);

    return actualAmountSpent;
  };

  // used to build line graph
  const buildLines = () => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const expectedMonthlyBudgets = determineExpectedMonthlyBudgets();
    const actualMonthlyBudgets = determineActualMonthlyBudgets();

    let newLine = [];

    // use expected and actual budget data
    const lineBudgetData = {
      labels: months,
      datasets: [
        {
          label: "Expected Budgets",
          fill: false,
          lineTension: 0.5,
          backgroundColor: "rgba(75,192,192,1)",
          borderColor: "rgba(0,0,0,1)",
          borderWidth: 2,
          data: expectedMonthlyBudgets,
        },
        {
          label: "Actual Budgets",
          fill: true,
          lineTension: 0.5,
          backgroundColor: "violet",
          borderColor: "rgba(0,0,0,1)",
          borderWidth: 2,
          data: actualMonthlyBudgets,
        },
      ],
    };

    // create a line chart using the data
    const lineChart = (
      <div>
        <Line
          data={lineBudgetData}
          options={{
            title: {
              display: true,
              text: "Expected VS. Actual Monthly Budgets",
              fontSize: 20,
            },
            legend: {
              display: true,
              position: "right",
            },
          }}
        />
      </div>
    );

    newLine.push(lineChart);
    setLine(newLine);

    // now show the line chart
    setShow({
      pie: false,
      line: true,
      bar: false,
    });
  };

  // used to build a bar chart comparing expected budget vs amount spent yearly for an item
  const buildBar = (item) => {
    // if no item entered, return
    if (!item.length) return;
    const expectedSpentPerYear = determineExpectedSpentPerYear(item);
    const actualSpentPerYear = determineActualSpentPerYear(item);

    const newBar = [];
    // use expectedSpentPerYear and actualSpentPerYear as data
    const barBudgetData = {
      labels: ["Expected Budget", "Actual Spent"],
      datasets: [
        {
          label: item,
          backgroundColor: "rgba(75,192,192,1)",
          borderColor: "rgba(0,0,0,1)",
          borderWidth: 2,
          data: [expectedSpentPerYear, actualSpentPerYear],
        },
      ],
    };

    // create a bar chart using the data
    const barChart = (
      <div>
        <Bar
          data={barBudgetData}
          options={{
            title: {
              display: true,
              text: "Yearly Budget Comparison",
              fontSize: 20,
            },
            legend: {
              display: true,
              position: "right",
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                    min: 0,
                  },
                },
              ],
            },
          }}
        />
      </div>
    );
    newBar.push(barChart);
    setBar(newBar);

    // now show the bar chart
    setShow({
      pie: false,
      line: false,
      bar: true,
    });
  };

  // used to build a pie chart
  const buildCharts = () => {
    // show the pie chart
    setShow({
      pie: true,
      line: false,
      bar: false,
    });

    // return if no new budgets exist in state
    if (budgets.length === chartBudgets.length) return;

    const newCharts = [];
    const newChartBudgets = [];

    // month selected to view
    const month = monthViewing;
    let monthBudgets = [];
    let monthBudget = [];

    // create an array of budgets associated with each month

    monthBudget = Array.from(budgets.slice());
    monthBudget = monthBudget.filter((budget) => {
      return budget.month === month;
    });

    // if month data found, push each budget to array
    if (monthBudget.length && monthBudget !== undefined) {
      // push each added budget to newChartsBudget
      monthBudget.forEach((budget) => newChartBudgets.push(budget));
      monthBudgets.push(monthBudget);
    }

    // cycle through each data point in array to create a pie slice
    for (let month of monthBudgets) {
      const monthBudgetData = {
        labels: month.map((budget) => budget.title),
        datasets: [
          {
            label: month[0].month,
            backgroundColor: month.map((budget) => budget.dataColor),
            hoverBackgroundColor: month.map((budget) => budget.dataColor),
            data: month.map((budget) => budget.budget),
          },
        ],
      };

      const newActualSpent = [];
      const inputsForActualSpent = [];
      let counter = [];

      // now build a chart using the data, along with a form to enter actual expenses for each budget
      const chart = (
        <div key={month[0].month} className={classes.Pie}>
          <h2>Enter Actual Expenses!</h2>
          <Pie
            data={monthBudgetData}
            width={600}
            options={{
              title: {
                display: true,
                text: `${monthBudgetData.datasets[0].label} Budget`,
                fontSize: 20,
              },
              legend: {
                display: false,
              },
            }}
          />
          <Form
            submitHandler={(event) => {
              submitActualExpenses(event, newActualSpent);
              getBudget();
            }}
            submitValue="Submit Actual Expenses"
          >
            {month.forEach((monthlyBudget) => {
              console.log('Monthly budget', monthlyBudget);
              const id = monthlyBudget.id;
              const actualSpentDetails = {
                id: id,
                amount: monthlyBudget.actualSpent,
              };

              console.log(id);
              console.log('details', actualSpentDetails);

              newActualSpent.push(actualSpentDetails);
              setActualSpent([newActualSpent]);

              let input = (
                <Input
                  inputClass={classes.AmountBox}
                  placeholder={monthlyBudget.title}
                  type="text"
                  name="amountSpent"
                  change={(event) => {
                    handleActualSpent(
                      monthlyBudget.id,
                      event.target.value,
                      newActualSpent
                    );
                  }}
                  value={newActualSpent.amount}
                />
              );
              inputsForActualSpent.push(input);
              counter++;
            })}
            {inputsForActualSpent}
          </Form>
        </div>
      );
      newCharts.push(chart);
    }
    // now set chart to include new chart data
    setChartBudgets(newChartBudgets);
    setCharts(newCharts);
  };

  // static data including charts and forms for user to enter new budgets and query data
  return (
    <div>
      <NavItems />
      <Hero />
      <h2 className={classes.Heading}>Dashboard</h2>
      <div className={classes.Dashboard}>
        <div className={classes.InputSpace}>
          <h3>Enter a new budget!</h3>
          <Form submitHandler={submitHandler} submitValue="Submit Budget">
            <div className={classes.SketchWrapper}>
              <SketchPicker
                color={dataColor}
                onChangeComplete={(color) => setDataColor(color.hex)}
              />
            </div>
            <div className={classes.NewBudgetWrapper}>
              <div className={classes.BoxName}>
                <p>Title</p>
                <Input
                  inputClass={classes.NewInputBox}
                  type="text"
                  name="title"
                  change={(event) => setTitle(event.target.value)}
                  value={title}
                />
              </div>
              <div className={classes.BoxName}>
                <p>Budget</p>
                <Input
                  inputClass={classes.NewInputBox}
                  type="text"
                  name="budget"
                  change={(event) => setBudget(event.target.value)}
                  value={budget}
                />
              </div>
              <div className={classes.BoxName}>
                <p>Tags</p>
                <Input
                  inputClass={classes.NewInputBox}
                  type="text"
                  name="tags"
                  change={(event) => setTags(event.target.value)}
                  value={tags}
                />
              </div>
            </div>
            <MonthSelector
              monthClass={classes.MonthSelection}
              change={(event) => setMonth(event.target.value)}
            />
          </Form>
        </div>
      </div>
      <div className={classes.Charts}>
        <div className={classes.BudgetWrapper}>
          <Button buttonClass={classes.InputButtonBlock} click={getBudget}>
            Get Budget Chart
          </Button>
          <MonthSelector
            monthClass={classes.MonthSelectionBlock}
            change={(event) => {
              setMonthViewing(event.target.value);
              buildCharts();
            }}
          />
        </div>
        <Button buttonClass={classes.InputButton} click={buildLines}>
          Budget/Actual Comparison
        </Button>
        <div className={classes.InputSpace}>
          <h3>Check Yearly Spending for a budget type!</h3>
          <Input
            inputClass={classes.InputBox}
            type="text"
            name="Yearly Spending"
            change={(event) => setBarQuery(event.target.value)}
            value={barQuery}
          />
          <Button
            buttonClass={classes.InputButton}
            click={() => buildBar(barQuery)}
          >
            Yearly Spending
          </Button>
        </div>
        {show.pie ? charts : null}
        {show.line ? line : null}
        {show.bar ? bar : null}
      </div>
    </div>
  );
};

export default Dashboard;
