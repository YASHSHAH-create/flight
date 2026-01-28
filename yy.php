<?php

include('../includes/dbconnection.php');

$user_id = $_SESSION['bpmsaidpreptl'];

$userid = $_SESSION['user_sessionpreptl'];



if (!isset($_SESSION['user_sessionpreptl'])) {

    header('location:logout.php');

}





$user_id = $_SESSION['bpmsaidpreptl'];



// Retrieve data from waiting table

$count_waiting = mysqli_fetch_assoc(mysqli_query($con, "SELECT COUNT(*) AS count FROM waiting WHERE user_id = $user_id"))["count"];



// Retrieve data from tracker table for each status

$count_intransit = mysqli_fetch_assoc(mysqli_query($con, "SELECT COUNT(*) AS count FROM tracker WHERE user = $user_id AND status = 'In-Transit'"))["count"];

$count_mumbai = mysqli_fetch_assoc(mysqli_query($con, "SELECT COUNT(*) AS count FROM tracker WHERE user = $user_id AND status = 'MUMBAI'"))["count"];

$count_delivered = mysqli_fetch_assoc(mysqli_query($con, "SELECT COUNT(*) AS count FROM tracker WHERE user = $user_id AND status = 'Delivered'"))["count"];



// Update the last_stats field in tbladmin

$current_counts = $count_waiting . ',' . $count_intransit . ',' . $count_mumbai . ',' . $count_delivered;



// Get the previous counts from tbladmin

$previous_counts = mysqli_fetch_assoc(mysqli_query($con, "SELECT last_stats FROM tbladmin WHERE ID = $user_id"))["last_stats"];

mysqli_query($con, "UPDATE tbladmin SET last_stats = '$current_counts' WHERE ID = $user_id");

$previous_counts = $previous_counts == "" ? '0,0,0,0' : $previous_counts;

// Calculate the difference in counts

$diff_counts = array();

$current_counts_array = explode(",", $current_counts);

$previous_counts_array = explode(",", $previous_counts);



for ($i = 0; $i < count($current_counts_array); $i++) {

    $diff = intval($current_counts_array[$i]) - intval($previous_counts_array[$i]);

    array_push($diff_counts, $diff);

}





// Store the difference in counts as variables

$diff_waiting = $diff_counts[0];

$diff_intransit = $diff_counts[1];

$diff_mumbai = $diff_counts[2];

$diff_delivered = $diff_counts[3];



// Display the difference in counts as +x or -x

$diff_waiting = ($diff_waiting > 0 ? '+' : '') . $diff_waiting;

$diff_intransit = ($diff_intransit > 0 ? '+' : '') . $diff_intransit;

$diff_mumbai = ($diff_mumbai > 0 ? '+' : '') . $diff_mumbai;

$diff_delivered = ($diff_delivered > 0 ? '+' : '') . $diff_delivered;



$diff_waiting = $diff_waiting == "0" ? "" : "<span class='badge bg-" . ($diff_counts[0] > 0 ? "success" : "danger") . "'>$diff_waiting  </span>";

$diff_intransit = $diff_intransit == "0" ? "" : "<span class='badge bg-" . ($diff_counts[1] > 0 ? "success" : "danger") . "'>$diff_intransit</span>";

$diff_mumbai = $diff_mumbai == "0" ? "" : "<span class='badge bg-" . ($diff_counts[2] > 0 ? "success" : "danger") . "'>$diff_mumbai   </span>";

$diff_delivered = $diff_delivered == "0" ? "" : "<span class='badge bg-" . ($diff_counts[3] > 0 ? "success" : "danger") . "'>$diff_delivered</span>";





// Check if $_SESSION['username'] is null, blank or undefined

if (!isset($_SESSION['username']) || empty($_SESSION['username'])) {

    // Fetch username from database

    $idd = $_SESSION['bpmsaidpreptl'];

    $query = mysqli_query($con, "select UserName from tbladmin where ID='$idd'");

    $ret = mysqli_fetch_array($query);

    if ($ret > 0) {

        // Set username to $_SESSION['username']

        $_SESSION['username'] = $ret['UserName'];

    }

}



?>

<!DOCTYPE html>

<html lang="en" class="light-style layout-navbar-fixed layout-menu-fixed" dir="ltr" data-theme="theme-default"
    data-assets-path="assets/" data-template="vertical-menu-template">

<head>

    <meta charset="utf-8" />

    <meta name="viewport"
        content="width=device-width, initial-scale=1.0, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0" />

    <title>Dashboard | <?= @$_SESSION['name']; ?> | <?= date("h:i"); ?> </title>

    <meta name="description" content="" />

    <link rel="icon" type="image/x-icon" href="files/logo.png" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />

    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <link
        href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
        rel="stylesheet" />

    <link rel="stylesheet" href="assets/vendor/css/rtl/core.css" class="template-customizer-core-css" />



    <link rel="stylesheet" href="assets/vendor/fonts/boxicons.css" />

    <link rel="stylesheet" href="assets/vendor/fonts/fontawesome.css" />

    <link rel="stylesheet" href="assets/vendor/fonts/flag-icons.css" />

    <link rel="stylesheet" href="assets/vendor/css/rtl/core.css" class="template-customizer-core-css" />

    <link rel="stylesheet" href="assets/vendor/css/rtl/theme-default.css" class="template-customizer-theme-css" />

    <link rel="stylesheet" href="assets/css/demo.css" />

    <link rel="stylesheet" href="assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css" />

    <link rel="stylesheet" href="assets/vendor/libs/typeahead-js/typeahead.css" />

    <link rel="stylesheet" href="assets/vendor/libs/apex-charts/apex-charts.css" />

    <link rel="stylesheet" href="assets/vendor/css/pages/card-analytics.css" />

    <script src="assets/vendor/js/helpers.js"></script>
    <script src="assets/vendor/js/template-customizer.js"></script>

    <script src="assets/js/config.js"></script>

</head>

<body>

    <div class="layout-wrapper layout-content-navbar">

        <div class="layout-container">



            <?php include_once('includes/sidebar.php'); ?>

            <div class="layout-page">



                <?php include_once('includes/header.php'); ?>

                <div class="content-wrapper">

                    <div class="container-xxl flex-grow-1 container-p-y">





                        <div class="row g-4 mb-4">

                            <div class="col-sm-6 col-xl-3" onclick="window.location.href='waiting.php'"
                                style="cursor: -webkit-grab;">

                                <div class="card">

                                    <div class="card-body">

                                        <div class="d-flex align-items-start justify-content-between">

                                            <div class="content-left">

                                                <span>Waiting</span>

                                                <div class="d-flex align-items-end mt-2">

                                                    <h4 class="mb-0 me-2"><?= $count_waiting; ?></h4>

                                                    <small class="text-success"> <?= $diff_waiting; ?> </small>

                                                </div>



                                            </div>

                                            <span class="badge bg-label-danger rounded p-2">

                                                <i class="bx bx-time-five bx-sm"></i>

                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div class="col-sm-6 col-xl-3" onclick="window.location.href='in-transit.php'"
                                style="cursor: -webkit-grab;">

                                <div class="card">

                                    <div class="card-body">

                                        <div class="d-flex align-items-start justify-content-between">

                                            <div class="content-left">

                                                <span>In-Transit</span>

                                                <div class="d-flex align-items-end mt-2">

                                                    <h4 class="mb-0 me-2"><?= $count_intransit; ?></h4>

                                                    <small class="text-success"><?= $diff_intransit; ?> </small>

                                                </div>



                                            </div>

                                            <span class="badge bg-label-warning rounded p-2">

                                                <i class="bx bx-trip bx-sm"></i>

                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div class="col-sm-6 col-xl-3" onclick="window.location.href='in-mumbai.php'"
                                style="cursor: -webkit-grab;">

                                <div class="card">

                                    <div class="card-body">

                                        <div class="d-flex align-items-start justify-content-between">

                                            <div class="content-left">

                                                <span>In-Mumbai</span>

                                                <div class="d-flex align-items-end mt-2">

                                                    <h4 class="mb-0 me-2"><?= $count_mumbai; ?></h4>

                                                    <small class="text-danger"><?= $diff_mumbai; ?> </small>

                                                </div>



                                            </div>

                                            <span class="badge bg-label-primary rounded p-2">

                                                <i class="bx bx-building-house bx-sm"></i>

                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div class="col-sm-6 col-xl-3" onclick="window.location.href='delivered.php'"
                                style="cursor: -webkit-grab;">

                                <div class="card">

                                    <div class="card-body">

                                        <div class="d-flex align-items-start justify-content-between">

                                            <div class="content-left">

                                                <span>Delivered</span>

                                                <div class="d-flex align-items-end mt-2">

                                                    <h4 class="mb-0 me-2"><?= $count_delivered; ?></h4>

                                                    <small class="text-success"><?= $diff_delivered; ?> </small>

                                                </div>



                                            </div>

                                            <span class="badge bg-label-success rounded p-2">

                                                <i class="bx bx-home bx-sm"></i>

                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <div class="row g-4 mb-4">

                            <div class="col-12">

                                <div class="container mt-4">

                                    <h1 class="text-center">Order Process</h1>



                                    <div class="alert alert-warning mt-4">

                                        <strong>Important for Orders to China:</strong>

                                        <ul>



                                            <li><strong>China</strong> is for products without batteries.</li>

                                            <li>Sometimes, the label may not include a name in China. So, it is crucial
                                                to fill out the Google form at the bottom of the China address.</li>

                                            <li>If ordering to <strong>China</strong>, fill out the Google form linked
                                                with that address.</li>

                                        </ul>

                                    </div>



                                    <p><strong>ETA for all warehouses:</strong> 14 days once delivered to our
                                        international warehouse.</p>



                                    <div class="row">

                                        <div class="col-lg-6 mb-4">

                                            <h3 class="mt-4">Order Status Process</h3>

                                            <p>To check the status of your Delivo packages, follow these steps:</p>

                                            <ol>

                                                <li>Log on to <a href="https://bkicks.in">bkicks.in</a>.</li>

                                                <li>Sign up for an account.</li>

                                                <li>Go to the <strong>“Track Package”</strong> section and upload your
                                                    tracking information.</li>

                                                <li>If it shows <strong>“Waiting”</strong>, it means the package is not
                                                    dispatched yet.</li>

                                                <li>If it shows <strong>“In Transit”</strong>, it means it has been
                                                    dispatched from our international warehouse. Please add 10 days to
                                                    the dispatch date on our website.</li>

                                                <li>If it shows <strong>“Mumbai”</strong>, it means the package is in
                                                    our Mumbai warehouse. Please contact the Mumbai team to dispatch it.
                                                </li>

                                            </ol>

                                        </div>



                                        <div class="col-lg-6 mb-4">

                                            <h3 class="mt-4">Additional Notes & Pricing</h3>

                                            <p>
                                                <strong>1kg Minimum:</strong> Please do not ship items under 1kg (no insurance coverage).
                                            </p>

                                            <p>
                                                <strong>No Merging:</strong> We ship packages exactly as received. We cannot hold or consolidate them.
                                            </p>

                                            <p>
                                                <strong>Billing:</strong> Every package is weighed and charged separately, even if sent together.
                                            </p>

                                            <p>

                                                <strong>Weight Billing:</strong> All packages will be billed to the
                                                closest <strong>0.5</strong>. <br>

                                                For example, <strong>1.2</strong> will be considered as
                                                <strong>1.5</strong> & <strong>1.6</strong> will be considered as
                                                <strong>2.0</strong>.

                                            </p>



                                            <p>

                                                <strong>B2C Pricing:</strong> <strong>1650/- per kilo</strong> for all
                                                warehouses.

                                                <br>

                                                *In case you have an agent, please contact them as agents offer a
                                                different price.*

                                            </p>



                                            <p>

                                                <strong>For B2B rates (100kg+ Monthly):</strong><br>

                                                WhatsApp DM us on: <strong>+852 5282 4016</strong>

                                            </p>



                                            <p>-Thanks</p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>



                    <?php include_once('includes/footer.php'); ?>

                    <div class="content-backdrop fade"></div>

                </div>

            </div>

        </div>

        <div class="layout-overlay layout-menu-toggle"></div>

        <div class="drag-target"></div>

    </div>

    <script src="assets/vendor/libs/jquery/jquery.js"></script>

    <script src="assets/vendor/libs/popper/popper.js"></script>

    <script src="assets/vendor/js/bootstrap.js"></script>

    <script src="assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js"></script>

    <script src="assets/vendor/libs/hammer/hammer.js"></script>

    <script src="assets/vendor/libs/i18n/i18n.js"></script>

    <script src="assets/vendor/libs/typeahead-js/typeahead.js"></script>

    <script src="assets/vendor/libs/toastr/toastr.js"></script>

    <script src="assets/vendor/js/menu.js"></script>

    <script src="assets/vendor/libs/apex-charts/apexcharts.js"></script>

    <script src="assets/js/main.js"></script>

    <script src="assets/js/dashboards-ecommerce.js"></script>

    <script src="assets/vendor/libs/chartjs/chartjs.js"></script>

    <script src="assets/js/charts-chartjs.js"></script>

    <style>
        #chat3 .form-control {

            border-color: transparent;

        }

        #chat3 .form-control:focus {

            border-color: transparent;

            box-shadow: inset 0px 0px 0px 1px transparent;

        }

        .badge-dot {

            border-radius: 50%;

            height: 10px;

            width: 10px;

            margin-left: 2.9rem;

            margin-top: -.75rem;

        }
    </style>

    <script>

        var locationurl = "";

    </script>

    <script src="chat/users.js"></script>

    <script src="chat/chat.js"></script>

    <!-- Shipping Delay Popup -->
    <!--<div class="modal fade" id="delayed-shipping-popup" tabindex="-1" style="z-index: 10000;" aria-hidden="true">-->
    <!--    <div class="modal-dialog modal-dialog-centered" role="document">-->
    <!--        <div class="modal-content">-->
    <!--            <div class="modal-header bg-warning">-->
    <!--                <h5 class="modal-title text-white"><i class='bx bx-error-circle'></i> Important Shipping Update</h5>-->
    <!--                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"-->
    <!--                    onclick="closeShippingPopup()"></button>-->
    <!--            </div>-->
    <!--            <div class="modal-body">-->
    <!--                <p><strong>Hongkong & China flights have reduced space for all cargo firms by 80%.</strong></p>-->
    <!--                <p>Due to:</p>-->
    <!--                <ul>-->
    <!--                    <li>Passenger space going up</li>-->
    <!--                    <li>December being their most busy passenger month</li>-->
    <!--                </ul>-->
    <!--                <p>Hence please do not look at HK China as express till December 20, package timelines will be-->
    <!--                    pushed massively.</p>-->
    <!--                <p>-Thanks</p>-->
    <!--            </div>-->
    <!--            <div class="modal-footer justify-content-between">-->
    <!--                <div class="form-check">-->
    <!--                    <input class="form-check-input" type="checkbox" id="dontShowAgainShipping">-->
    <!--                    <label class="form-check-label" for="dontShowAgainShipping">-->
    <!--                        Do not show again-->
    <!--                    </label>-->
    <!--                </div>-->
    <!--                <button type="button" class="btn btn-primary" onclick="closeShippingPopup()"-->
    <!--                    data-bs-dismiss="modal">Close</button>-->
    <!--            </div>-->
    <!--        </div>-->
    <!--    </div>-->
    <!--</div>-->



</body>

</html>