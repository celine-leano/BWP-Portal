<?php
/*
 * CodedInk
 * BWP-Portal/model/logout.php
 * Logs user out
 */
session_start();
session_destroy();
header("Location: /BWP-Portal");