/* jshint unused:false */

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('#login').click(login);
    $('#seed').click(seed);
    $('body').on('click', '#getForest', getForest);
    $('#forest').on('click', '.tree.alive', grow);
    $('#forest').on('click', '.chop', chop);
    $('#sellWood').click(sellWood);
  }

  function sellWood(){
    var userId = $('#storeUsername').attr('data-id');
    $.ajax({
      url: `/sell/${userId}/wood`,
      type: 'PUT',
      success: res=>{
        $('#cash').text(`$: ${res.cash}`);
        $('#wood').text(`Wood: ${res.wood}`);
      }
    });
  }

  function chop(){
    var treeId = $(this).prev().data('id');
    var tree = $(this).parent();
    if($(this).prev().hasClass('alive') && $(this).prev().hasClass('adult')){
      $.ajax({
        url: `/tree/${treeId}/chop`,
        type: 'PUT',
        success: res=>{
          tree.replaceWith(res.treeHTML);
          $('#playerName').text(`Player: ${res.user.username}`);
          $('#wood').text(`Wood: ${res.user.wood}`);
        }
      });
    }
  }

  function grow(){
    var tree = $(this).parent();
    var treeId = $(this).data('id');

    $.ajax({
      url: `/tree/${treeId}/grow`,
      type: 'PUT',
      dataType: 'html',
      success: t=>{
        tree.replaceWith(t);
      }
    });
  }

  function getForest(){
    var userId = $('#storeUsername').attr('data-id');
    console.log(userId);
    $.ajax({
      url: `/forest/${userId}`,
      type: 'GET',
      cache: 'false',
      dataType: 'html',
      success: r=>{
        $('#forest').empty();
        $('#forest').append(r);
      }
    });
  }

  function login(e){
    var data = $(this).closest('form').serialize();

    $.ajax({
      url: '/login',
      type: 'POST',
      data: data,
      success: response=>{
        $('#storeUsername').text(response.username);
        $('#playerName').text(`Player: ${response.username}`);
        $('#wood').text(`Wood: ${response.wood}`);
        $('#cash').text(`$:${response.cash}`);
        $('#storeUsername').attr('data-id', response._id.toString());
        $('#login').prev().val('');
        $('#forest').empty();
      }
    });

    e.preventDefault();
  }

  function seed(){
    var userId = $('#username').data('id');
    $.ajax({
      url: '/seed',
      type: 'POST',
      data: {userId: userId},
      success: tree=>{
        $('#forest').append(tree);
      }
    });
  }
})();
