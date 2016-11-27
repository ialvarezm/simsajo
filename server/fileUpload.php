<?php

if (isset($_FILES['uploaded_file'])) {
    // Example:
    if(move_uploaded_file($_FILES['uploaded_file']['tmp_name'], "../img/" . $_FILES['uploaded_file']['name'])){
        echo $_FILES['uploaded_file']['name']. " uploaded ...";
    } else {
        echo $_FILES['uploaded_file']['name']. " NOT uploaded ...";
    }

    exit;
} else {
    echo "no";
}

 ?>
