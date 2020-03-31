<?php
require_once "functions.php";
require_once "data.php";

$title = $app_name . " | Главная";

$page_content = include_template("index.php");
$svg = include_template("common/svg.php");

$layout_content = include_template(
    "layout.php",
    [
        "content" => $page_content,
        "title" => $title,
        "svg"=>$svg
    ]
);
print($layout_content);
