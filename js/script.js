var Lotto = {};
Lotto.html = null;
Lotto.table = []; // [{num: 1; count: 111;}, {num: 2; count: 222;}]
Lotto.lottoList = [];
Lotto.minCount;
Lotto.sumCount;

Lotto.loadPage = function () {
    var self = this, xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://www.nlotto.co.kr/lotto645Stat.do?method=statByNumber');
    xhr.setRequestHeader('Content-type', 'text/html');
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                self.html = $(xhr.responseText);
                self.makeTable();
                console.log(self.pickLotto());
            }
        }
    };
};

Lotto.makeTable = function () {
    var self = this, tr, nm, cnt, i, trs, j;
    trs = self.html.find('#printTarget').find('tbody').find('tr').toArray();
    trs.shift();
    trs.pop();
    for (i = 0; i < trs.length; i += 1) {
        tr = $(trs[i]);
        nm = parseInt(tr.find('td:first').find('img').attr('alt'));
        cnt = parseInt(tr.find('td:last').text());
        self.table[i] = {
            number: nm,
            count: cnt
        };
        if (self.minCount === undefined || cnt < self.minCount) {
            self.minCount = cnt;
        }
    }

    self.sumCount = 0;
    for (i = 0; i < self.table.length; i += 1) {
        self.table[i].count -= (self.minCount - 1);
        self.sumCount += self.table[i].count;
    }

    for (i = 0; i < self.table.length; i += 1) {
        self.table[i].rate = Math.ceil(self.table[i].count / self.sumCount * 1000);

        //        console.log(self.table[i].number + ' ' + self.table[i].count + ' ' + self.table[i].rate);
    }

    self.lottoList = [];
    for (i = 0; i < self.table.length; i += 1) {
        for (j = 0; j < self.table[i].rate; j += 1) {
            self.lottoList.push(self.table[i].number);
        }
    }
};

Lotto.pickLotto = function () {
    var i, ri, num, self = this, selectedNumber = [];

    while (selectedNumber.length < 6) {
        ri = Math.floor(Math.random() * (self.lottoList.length - 1));
        num = self.lottoList[ri];
        if (selectedNumber.indexOf(num) < 0) {
            selectedNumber.push(num);
        }
    }

    return selectedNumber.sort(function(a, b){return a-b});
};

$(function () {
    Lotto.loadPage();
});