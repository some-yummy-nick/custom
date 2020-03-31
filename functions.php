<?php

function debug($arr)
{
    echo "<pre>" . print_r($arr, true), "</pre>";
}

/**
 * Функция принимает два аргумента: имя файла шаблона и ассоциативный массив с данными для этого шаблона.
 * Функция возвращает строку — итоговый HTML-код с подставленными данными или описание ошибки
 *
 * @param $name string
 * @param $data array
 *
 * @return false|string
 */
function include_template($name, $data = null)
{
    $name = "templates/" . $name;
    if (!is_readable($name)) {
        return "Шаблон с именем " . $name . " не существует или недоступен для чтения";
    }
    ob_start();
    if ($data) extract($data);

    require $name;

    return ob_get_clean();
}
