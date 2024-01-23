const Tehsil = {
  Jammu: ["TSWO AKHNOOR", "TSWO JAMMU", "TSWO BISNAH", "TSWO R S PURA"],
  Rajouri: ["TSWO DHARAL", "TSWO BUDHAL", "TSWO NOWSHERA", "TSWO KALAKOTE"],
  Poonch: ["TSWO HAVELI", "TSWO MANDI", "TSWO SURANKOT", "TSWO MENDHAR"],
  Kathua: ["TSWO BANI", "TSWO BASOLI", "TSWO BILLAWAR", "TSWO KATHUA"],
};
const Further = {
  "WOMEN IN DISTRESS": [
    { id: "civilcondition", "Civil Condition": ["WIDOW", "DIVORCEE"] },
  ],
  "PHYSICALLY CHALLENGED PERSON": [
    {
      id: "typeofdis",
      "Type of Disability as per UDID Card": [
        "BLINDNESS",
        "LOW-VISION",
        "HEARING IMPAIRMENT",
        "OTHERS",
      ],
    },
    { id: "kindofdis", "Kind of Disability": ["PERMANENT", "TEMPORARY"] },
    { id: "perofdis", "Percentage of Disability": "" },
  ],
};
const previousBank = [
  {
    id: "prevBankName",
    "Bank Name": [
      "THE JAMMU AND KASHMIR BANK LTD.",
      "J & K GRAMEEN BANK",
      "ELLAQUAI DEHTI BANK",
      "INDIA POST PAYMENTS BANK",
    ],
  },
  { id: "prevBranchName", "Branch Name": "" },
  { id: "prevIfcsCode", "IFCS Code": "" },
  { id: "prevaccNumber", "Account Number": "" },
];
$(document).ready(function () {
  let selectdistteh = $(
    'select[id="district"], select[id="predistrict"], select[id="perdistrict"]'
  );

  selectdistteh.each(function () {
    // Add a change event trigger for each select element
    $(this).on("change", function () {
      let selectedDistrict = $(this).val();
      let id = $(this).attr("id");
      let tehsil =
        id == "district"
          ? "tehsil"
          : id == "predistrict"
          ? "pretehsil"
          : "pertehsil";
      $("#" + tehsil).empty();
      $("#" + tehsil).append(
        "<option value='Please Select'>Please Select</option>"
      );

      if (selectedDistrict != "Please Select") {
        Tehsil[selectedDistrict].map((item) =>
          $("#" + tehsil).append(`<option value=${item}>${item}</option>`)
        );
      }
    });
  });
  $("#sameaddress").change(function () {
    console.log($("#district").val());
    if ($(this).prop("checked")) {
      $("#peraddress").val($("#address").val());
      $("#perdistrict").val($("#predistrict").val());
      $("#perdistrict").trigger("change"); // to trigger and populate the tehsil select tag
      $("#pertehsil").val($("#pretehsil").val());
      $("#perblockname").val($("#blockname").val());
      $("#perpanchayat").val($("#panchayat").val());
      $("#pervillage").val($("#village").val());
      $("#perward").val($("#ward").val());
      $("#perpincode").val($("#prepincode").val());
    } else {
      $("#peraddress").val("");
      $("#perdistrict").val("Please Select");
      $("#perblockname").val("");
      $("#perpanchayat").val("");
      $("#pervillage").val("");
      $("#perward").val("");
      $("#perpincode").val("");
      $("#perdistrict").trigger("change"); // to trigger and empty the tehsil select tag
    }
  });

  $("#pensiontype").change(function () {
    let pensiontype = $(this).val();
    $("#further").empty();
    if (Further.hasOwnProperty(pensiontype)) {
      Further[pensiontype].map((item) => {
        for (let value in item) {
          if (value != "id") {
            $("#further").append(`
                    <div class="col-sm-6 fw-bold fs-6">
                        <label for="district" class="form-label">${value}</label>
                        <span class="text-danger">*</span>
                    </div>
                `);
            if (Array.isArray(item[value])) {
              let Options = "";
              item[value].map(
                (element) =>
                  (Options += `<option value=${element}>${element}</option>`)
              );
              $("#further").append(`
                    <div class="col-sm-6 mb-1">
                        <select class="form-select" id="${item["id"]}" name="${item["id"]}">
                            <option value="Please Select">Please Select</option>
                            ${Options}
                        </select>
                    </div>
                    `);
            } else {
              $("#further").append(`
                    <div class="col-sm-6">
                        <input type="text" class="form-control" id="${item["id"]}" name="${item["id"]}" />
                    </div>
                    `);
            }
          }
        }
      });
    }
  });

  $("#pensionform").submit(function (e) {
    e.preventDefault();
    const formData = new FormData(this);
    const formObject = {};
    formData.forEach(function (value, key) {
      if (value instanceof File && value.size === 0) {
        formObject[key] = "";
      } else {
        formObject[key] = value;
      }
    });

    if (!formObject.hasOwnProperty("gender")) {
      formObject["gender"] = "";
    }

    if (!formObject.hasOwnProperty("category")) {
      formObject["category"] = "";
    }

    if (!formObject.hasOwnProperty("iagree")) {
      formObject["iagree"] = "";
    }

    let result = true;
    for (let key in formObject) {
      if (formObject[key] == "" || formObject[key] == "Please Select") {
        result = false;
        createError(key, "This field is required");
      }
    }

    const jsonData = JSON.stringify(formObject);
    console.log(formObject);
    const postData = { data: jsonData };
    if (result) {
      // Use AJAX to send the object to the server
      $.ajax({
        type: "POST",
        url: "/Home/FormData", // Replace with your actual controller and action
        data: postData,
        success: function () {
          window.location.href = "/Home/Display"; // Redirect to the second page
        },
        error: function (error) {
          console.log(error);
        },
      });
    }
  });
  $("input").blur(function () {
    let id = $(this).attr("id");
    if ($("#" + id).val().length == 0 && id != "applicantpic") {
      createError(id, "This field is required");
    } else if (id == "guardian" || id == "applicantname") {
      if (!/^[a-zA-Z '.]+$/.test($(this).val())) {
        createError(
          id,
          "Please use letters (a-z, A-Z) and special characters (. and ') only."
        );
      } else {
        createError(id, "");
      }
    } else if (
      id == "mobile" ||
      id == "prepincode" ||
      id == "perpincode" ||
      id == "account"
    ) {
      let maxLength = 0;
      if (id == "mobile") maxLength = 10;
      else if (id == "prepincode" || id == "perpincode") maxLength = 6;
      else if (id == "account") maxLength = 16;

      if (!/^\d+$/.test($(this).val())) {
        createError(id, "Please enter only digits");
      } else if ($(this).val().length < maxLength) {
        createError(id, `Please enter at least ${maxLength} characters.`);
      } else {
        createError(id, "");
      }
    } else if (
      id !== "address" &&
      id !== "peraddress" &&
      id != "dob" &&
      id != "applicantpic" &&
      id != "email" &&
      id != "ifsc" &&
      id != "iagree" &&
      id != "sameaddress"
    ) {
      if (!/^[A-Za-z]+$/.test($(this).val())) {
        createError(id, "Please enter only charater(s).");
      } else if ($(this).val().length < 3) {
        createError(id, "Please enter at least 3 character(s).");
      } else createError(id, "");
    }
  });
  $("select").change(function () {
    let id = $(this).attr("id");

    if ($(this).val() == "Please Select") {
      createError(id, "This field is required.");
    } else {
      createError(id, "");
    }
  });
  function createError(id, msg) {
    if ($("#" + id + "msg").length) {
      $("#" + id + "msg").text(msg);
    } else {
      const newspan = $("<span>")
        .attr({ id: id + "msg", class: "errormsg" })
        .text(msg);
      $("#" + id).after(newspan);
    }
  }
  $("#further").on("change", "select", function () {
    let id = $(this).attr("id");
    console.log("here");
    if ($(this).val() == "Please Select") {
      createError(id, "This field is required.");
    } else {
      createError(id, "");
    }
  });

  $(document).ready(function () {
    // Attach change event handler to the date of birth input
    $("#dob").change(function () {
      // Get the selected date of birth
      let dob = $(this).val();

      // Calculate age based on the selected date
      let age = calculateAge(dob);

      // Update the age input field
      $("#age").val(age);
    });

    // Function to calculate age
    function calculateAge(dob) {
      let today = new Date();
      let birthDate = new Date(dob);
      let age = today.getFullYear() - birthDate.getFullYear();
      let monthDiff = today.getMonth() - birthDate.getMonth();

      // Adjust age based on the birth month
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    }
    $(document).ready(function () {
      // Attach change event handler to the pension type input
      $("#pensiontype").change(function () {
        // Get the selected pension type
        let pensionType = $(this).val();
        if (
          pensionType === "OLD AGE PENSION" ||
          pensionType === "PHYSICALLY CHALLENGED PERSON"
        ) {
          $("#gendercontainer").empty();
          $("#gendercontainer")
            .append(`<input type="radio" name="gender" value="MALE"> MALE <br>
            <input type="radio" name="gender" value="FEMALE"> FEMALE <br>`);
        } else if (pensionType === "WOMEN IN DISTRESS") {
          $("#gendercontainer").empty();
          $("#gendercontainer").append(`
            <input type="radio" name="gender" value="FEMALE"> FEMALE <br>`);
        } else if (pensionType === "TRANSGENDER PERSON") {
          $("#gendercontainer").empty();
          $("#gendercontainer").append(`
          <input type="radio" name="gender" value="TRANSGENDER"> TRANSGENDER <br>`);
        }
      });
    });
  });

  $("#ispreviousBank").change(function () {
    console.log($("#ispreviousBank").length);
    if ($(this).val() == "YES") {
      $("#previousBank").empty();
      let input = ``;

      previousBank.map((item) => {
        for (let element in item) {
          console.log(item);
          if (element != "id") {
            if (Array.isArray(item[element])) {
              let Options = "";
              item[element].map(
                (item) =>
                  (Options += `<option value="${item}">${item}</option>`)
              );
              input += `<select class="form-select"  id="${item["id"]}" name="${item["id"]}">
                  <option value="Please Select">Please Select</option>
                  ${Options}
                </select>`;
            } else {
              input = `<input class="form-control" id="${item["id"]}" name="${item["id"]}"/>`;
            }
            $("#previousBank").append(
              `<div class="col-sm-6 fw-bold fs-6 mb-1">
                  <label class="form-label" for="bank name">${element} </label>
                  <span class="text-danger">*</span>
                </div>
                <div class="col-sm-6 mb-1">
                    <input type="text"  class="form-control" id="${item["id"]}" name="${item["id"]}" />
                </div>`
            );
          }
        }
      });
    } else $("#previousBank").empty();
  });
});
