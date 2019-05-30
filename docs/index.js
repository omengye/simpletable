var results = [
    { id: '1', date: '2016-05-02', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄', province: '上海', city: '普陀区' },
    { id: '2', date: '2016-05-04', name: '王小虎', address: '上海市普陀区金沙江路 1517 弄', province: '上海', city: '普陀区' },
    { id: '3', date: '2016-05-01', name: '王小虎', address: '上海市普陀区金沙江路 1519 弄', province: '上海', city: '普陀区' },
    { id: '4', date: '2016-05-03', name: '王小虎', address: '上海市普陀区金沙江路 1516 弄', province: '上海', city: '普陀区' },
];

// 基础表格
function makeBasicTable() {
    var option = {
        tableClass: 'cgridTable',
        head: [
            {
                'data-field': 'id',
                'display': false
            },
            {
                'data-field': 'date',
                'name': '日期'
            },
            {
                'data-field': 'name',
                'name': '姓名'
            },
            {
                'data-field': 'address',
                'name': '地址'
            }
        ]
    };
    var ctable = cgrid.instance("basicTable", option);
    ctable.genTable(results);
}

// 固定表头
function fixedHeaderTable() {
    var option = {
        tableClass: 'cgridTable',
        head: [
            {
                'data-field': 'id',
                'display': false
            },
            {
                'data-field': 'date',
                'name': '日期'
            },
            {
                'data-field': 'name',
                'name': '姓名'
            },
            {
                'data-field': 'address',
                'name': '地址'
            }
        ],
        titleFixed: true,
    };
    var ctable = cgrid.instance("fixedHeaderTable", option);
    ctable.genTable(results.concat(results));
}

// 固定列
function fixedColumnTable() {
    var option = {
        tableClass: 'cgridTable cgridTable_fixedColumn',
        head: [
            {
                'data-field': 'id',
                'display': false
            },
            {
                'data-field': 'date',
                'name': '日期',
                'fixed': true
            },
            {
                'data-field': 'name',
                'name': '姓名',
                'fixed': true
            },
            {
                'data-field': 'province',
                'name': '省份'
            },
            {
                'data-field': 'city',
                'name': '市区'
            },
            {
                'data-field': 'address',
                'name': '地址'
            }
        ],
        titleFixed: true,
    };
    var ctable = cgrid.instance("fixedColumnTable", option);
    ctable.genTable(results);
}

// 固定列和表头
function fixedColHeadTable() {
    var option = {
        tableClass: 'cgridTable cgridTable_fixedColumn',
        head: [
            {
                'data-field': 'id',
                'display': false
            },
            {
                'data-field': 'date',
                'name': '日期',
                'fixed': true
            },
            {
                'data-field': 'name',
                'name': '姓名',
                'fixed': true
            },
            {
                'data-field': 'province',
                'name': '省份'
            },
            {
                'data-field': 'city',
                'name': '市区'
            },
            {
                'data-field': 'address',
                'name': '地址'
            }
        ],
        titleFixed: true,
    };
    var ctable = cgrid.instance("fixedColHeadTable", option);
    ctable.genTable(results.concat(results));
}

// 多级表头
function groupHeaderTable() {
    var option = {
        tableClass: 'cgridTable',
        head: [
            {
                'data-field': 'id',
                'display': false
            },
            {
                'data-field': 'date',
                'name': '日期'
            },
            {
                'data-field': 'delivery',
                'name': '配送信息',
                'children': [
                    {
                        'data-field': 'name',
                        'name': '姓名'
                    },
                    {
                        'data-field': 'addr',
                        'name': '地址',
                        'children': [
                            {
                                'data-field': 'province',
                                'name': '省份'
                            },
                            {
                                'data-field': 'city',
                                'name': '市区'
                            },
                            {
                                'data-field': 'address',
                                'name': '地址'
                            }
                        ]
                    },
                ]
            }
        ]
    };
    var ctable = cgrid.instance("groupHeaderTable", option);
    ctable.genTable(results);
}

// 单选
var oneRowSelTable;
function oneRowSelTable() {
    var option = {
        withCheckBox: true,
        disableMutiSel: true,
        tableClass: 'cgridTable',
        head: [
            {
                'data-field': 'id',
                'display': false
            },
            {
                'data-field': 'date',
                'name': '日期'
            },
            {
                'data-field': 'name',
                'name': '姓名'
            },
            {
                'data-field': 'address',
                'name': '地址'
            }
        ]
    };
    oneRowSelTable = cgrid.instance("oneRowSelTable", option);
    oneRowSelTable.genTable(results);
}

function oneRowClick() {
    var selectedRow = oneRowSelTable.getChecked();
    if (selectedRow.length < 1) {
        alert("请勾选一行");
    }
    else {
        alert(JSON.stringify(selectedRow[0]));
    }
}

// 多选
var multRowsSelTable;
function multRowsSelTable() {
    var option = {
        withCheckBox: true,
        disableMutiSel: false,
        tableClass: 'cgridTable',
        head: [
            {
                'data-field': 'id',
                'display': false
            },
            {
                'data-field': 'date',
                'name': '日期'
            },
            {
                'data-field': 'name',
                'name': '姓名'
            },
            {
                'data-field': 'address',
                'name': '地址'
            }
        ]
    };
    multRowsSelTable = cgrid.instance("multRowsSelTable", option);
    multRowsSelTable.genTable(results);
}

function multRowsClick() {
    var selectedRows = multRowsSelTable.getChecked();
    if (selectedRows.length < 1) {
        alert("请勾选一行");
    }
    else {
        alert(JSON.stringify(selectedRows));
    }
}

var mergeRowResult = [
    { id: '12987122', name: '王小虎', address: '上海市普陀区金沙江路 1518 弄', province: '上海', city: '普陀区' },
    { id: '12987122', name: '王小虎', address: '上海市普陀区金沙江路 1517 弄', province: '上海', city: '普陀区' },
    { id: '12987124', name: '王小虎', address: '上海市普陀区金沙江路 1519 弄', province: '上海', city: '普陀区' },
    { id: '12987124', name: '王小虎', address: '上海市普陀区金沙江路 1516 弄', province: '上海', city: '普陀区' },
    { id: '12987125', name: '王小虎', address: '上海市普陀区金沙江路 1516 弄', province: '上海', city: '普陀区' },
];

var mergeColumnResult = [
    { id: '12987122', name: '12987122', address: '上海市普陀区金沙江路 1518 弄', province: '上海', city: '普陀区' },
    { id: '12987123', name: '王小虎', address: '上海市普陀区金沙江路 1517 弄', province: '上海', city: '普陀区' },
    { id: '12987124', name: '12987124', address: '上海市普陀区金沙江路 1519 弄', province: '上海', city: '普陀区' },
    { id: '12987125', name: '王小虎', address: '上海市普陀区金沙江路 1516 弄', province: '上海', city: '普陀区' },
];

// 合并行
function mergeRowTable() {
    var option = {
        tableClass: 'cgridTable',
        head: [
            {
                'data-field': 'id',
                'name': 'ID',
                'mergeRow': true,
            },
            {
                'data-field': 'name',
                'name': '姓名'
            },
            {
                'data-field': 'province',
                'name': '省份'
            },
            {
                'data-field': 'city',
                'name': '市区'
            },
            {
                'data-field': 'address',
                'name': '地址'
            }
        ]
    };
    var ctable = cgrid.instance("mergeRowTable", option);
    ctable.genTable(mergeRowResult);
} 
        
// 合并列
function mergeColumnTable() {
    var option = {
        tableClass: 'cgridTable',
        head: [
            {
                'data-field': 'id',
                'name': 'ID'
            },
            {
                'data-field': 'name',
                'name': '姓名'
            },
            {
                'data-field': 'province',
                'name': '省份'
            },
            {
                'data-field': 'city',
                'name': '市区'
            },
            {
                'data-field': 'address',
                'name': '地址'
            }
        ],
        mergeinrows: [1,3],
        mergerowcellsize: 2,
    };
    var ctable = cgrid.instance("mergeColumnTable", option);
    ctable.genTable(mergeColumnResult);
}
